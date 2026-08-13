package bindings

import (
	"fmt"
	"strings"

	"github.com/cod3rboy/docchat/internal/ai"
	"github.com/cod3rboy/docchat/internal/app"
	"github.com/cod3rboy/docchat/internal/vectordb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const systemPrompt string = `
You are an expert, diligent research assistant dedicated solely to answering user queries based on provided contextual documents.
Your entire response MUST be grounded exclusively in the text snippets provided in the <CONTEXT> tags.
Do not use any external knowledge, general world knowledge, or assumptions. Your sole source of truth is the context given below.

[RULES OF ENGAGEMENT]
1. **Source Adherence:** Use only the information contained within the <CONTEXT>.
2. **Directness:** Answer the user's query directly and concisely. Avoid unnecessary preamble or introductory fluff ("Based on the documents...", etc.).
3. **Handling Missing Information (Crucial):** If the provided context does not contain enough information to answer the user's question, you must state this clearly and politely. Do NOT hallucinate, speculate, or guess. Use the specific phrase: "Sorry, I do not have sufficient information regarding this query."
4. **Tone & Style:** Be concise, clear, and direct. Use markdown formatting (code blocks, bullet points) to make technical steps readable.
5. **Multi-turn:** If chat history is provided, maintain conversational context while still prioritizing the retrieved documentation chunks for factual accuracy.

<CONTEXT>
%s
</CONTEXT>
`

type StopEventChan chan struct{}

type Assistant struct {
	app *app.App

	stopSignals map[string]StopEventChan
}

func NewAssistant(app *app.App) *Assistant {

	return &Assistant{
		app:         app,
		stopSignals: make(map[string]StopEventChan),
	}
}

func (a *Assistant) StreamReply(
	conversation []ai.Message,
	replyEventName string,
) (string, error) {
	recentQuery := conversation[len(conversation)-1]
	recentQueryMessage := recentQuery.Content

	// replyEventName holds the thread id
	thread, err := a.app.DB.Threads.GetThread(a.app.Context(), replyEventName)
	if err != nil {
		return "", err
	}

	embedding, err := a.app.LLM.Embedding(
		a.app.Context(),
		"embeddinggemma:latest",
		recentQueryMessage,
		vectordb.VectorDimensions,
	)
	if err != nil {
		return "", err
	}

	docs, _ := a.app.VectorDB.SearchByWorkspace(
		a.app.Context(),
		embedding.Vector,
		thread.Workspace,
	)

	knowledge := strings.Builder{}
	for _, doc := range docs {
		knowledge.WriteString(doc.Content)
		knowledge.WriteString("\n\n")
	}

	systemPrompt := fmt.Sprintf(systemPrompt, knowledge.String())
	systemMessage := ai.Message{
		Role:    "system",
		Content: systemPrompt,
	}

	finalConversation := make([]ai.Message, len(conversation)+1)
	finalConversation[0] = systemMessage
	copy(finalConversation[1:], conversation)

	chunks, errs := a.app.LLM.Stream(
		a.app.Context(),
		"gemma4:e2b",
		finalConversation,
	)

	stopSignal := make(StopEventChan, 1)
	a.stopSignals[replyEventName] = stopSignal
	defer func() {
		delete(a.stopSignals, replyEventName)
		close(stopSignal)
	}()

	stop := false
	lastChunk := ai.Chunk{}
	for {
		stop = false
		select {
		case chunk, ok := <-chunks:
			if !ok {
				stop = true
			} else {
				lastChunk = chunk
				runtime.EventsEmit(
					a.app.Context(),
					replyEventName,
					chunk.Delta,
				)
			}
		case <-stopSignal:
			stop = true
		case <-a.app.Context().Done():
			stop = true
		}

		if stop {
			break
		}
	}

	return lastChunk.Delta, <-errs
}

func (a *Assistant) StopStreamReply(replyEventName string) {
	stopSignal, ok := a.stopSignals[replyEventName]
	if !ok {
		return
	}

	stopSignal <- struct{}{}
}
