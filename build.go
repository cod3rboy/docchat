package main

var (
	version string = "dev"
	build   string = "unknown"
)

type BuildInfo struct{}

func (b *BuildInfo) Version() string {
	return version
}

func (b *BuildInfo) Build() string {
	return build
}
