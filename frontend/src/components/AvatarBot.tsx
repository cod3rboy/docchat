export function AvatarBot() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      {/*Antenna */}
      <path
        d="M128 26V52"
        stroke="#015A9E"
        stroke-width="6"
        stroke-linecap="round"
      />

      <circle
        cx="128"
        cy="18"
        r="11"
        fill="#0181E0"
        stroke="#015A9E"
        stroke-width="5"
      />

      {/*Left Ear */}
      <rect
        x="18"
        y="90"
        width="34"
        height="76"
        rx="17"
        fill="#0181E0"
        stroke="#015A9E"
        stroke-width="5"
      />

      {/*Right Ear */}
      <rect
        x="204"
        y="90"
        width="34"
        height="76"
        rx="17"
        fill="#0181E0"
        stroke="#015A9E"
        stroke-width="5"
      />

      {/*Head */}
      <rect
        x="48"
        y="52"
        width="160"
        height="148"
        rx="34"
        fill="#0181E0"
        stroke="#015A9E"
        stroke-width="5"
      />

      {/*Eye Whites*/}
      <circle cx="95" cy="118" r="26" fill="#FFFFFF" />
      <circle cx="161" cy="118" r="26" fill="#FFFFFF" />

      {/*Pupils */}
      <circle cx="102" cy="120" r="11" fill="#0F3D91" />
      <circle cx="154" cy="120" r="11" fill="#0F3D91" />

      {/*Eye Highlights*/}
      <circle cx="98" cy="115" r="4" fill="#FFFFFF" />
      <circle cx="150" cy="115" r="4" fill="#FFFFFF" />

      {/*Smile */}
      <path
        d="M104 154
             Q128 172 152 154"
        fill="none"
        stroke="#0F3D91"
        stroke-width="7"
        stroke-linecap="round"
      />

      {/*Head Highlight */}
      <path
        d="M72 76
             Q88 58 122 60"
        fill="none"
        stroke="#66C6FF"
        stroke-width="5"
        stroke-linecap="round"
        opacity=".75"
      />
    </svg>
  );
}
