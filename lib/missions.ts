export const campaignStages = [
  [
    {
      "title": "Eclipse log",
      "algorithm": "Vigen\u00e8re",
      "brief": "Read the seven-line relay log to discover a repeating keyword. The lead characters carry the signal. Decrypt the complete transmission.",
      "evidence": "Evening carrier stable.\nControl room empty.\nLunar beacon fading.\nInbound packets repeat.\nPolar relay active.\nSatellite descending.\nEcho acknowledged.",
      "hints": [
        "Use the first letter of each log line, in its original order.",
        "That seven-letter word is the Vigen\u00e8re keyword. Decode the transmission to recover the next key."
      ],
      "prompt": "Submit the entire decoded relay-key announcement.",
      "code": "VGWINCICKDTPFXITY",
      "digest": "f5d22098b0f9c352ce9217fda9fc215ac0d5496fd4a2b545433d77b64f1ac5e4"
    },
    {
      "title": "The long rendezvous",
      "algorithm": "Vigen\u00e8re",
      "brief": "Use the keyword recovered in layer 1. This longer Vigen\u00e8re message has no spaces. Keep the full rendezvous instruction intact.",
      "evidence": "KEY SOURCE: PREVIOUS DECODED TRANSMISSION\nALIGNMENT: FIRST LETTER / A=0 \u2026 Z=25",
      "hints": [
        "The recovered keyword follows RELAY KEY IS in the previous message.",
        "Repeat the recovered keyword across the entire ciphertext. Decode all letters; no characters are padding."
      ],
      "prompt": "Submit the complete rendezvous instruction.",
      "code": "XERMXYRNOHKMVELTGAIEBCTUHFJRCVNMSILLFGXVDVONVZLK",
      "digest": "0e409e25ea3874069e9af930ddedfbc5700df31f20c9fce9d500b69add9e2174"
    }
  ],
  [
    {
      "title": "Known signal",
      "algorithm": "Vigen\u00e8re",
      "brief": "The six-letter keyword was lost. Intelligence confirms that the first six plaintext letters are FOLLOW. Recover the keyword from that aligned excerpt, then decrypt the full Vigen\u00e8re transmission.",
      "evidence": "CONFIRMED PLAINTEXT PREFIX: FOLLOW\nKEYWORD LENGTH: 6\nOFFSET: 0 / A=0 \u2026 Z=25",
      "hints": [
        "Compare only the first six ciphertext letters with FOLLOW. For each position, K = (C \u2212 P + 26) mod 26.",
        "Use Recover key in Cipher Lab on those two six-letter excerpts. Then switch to Decode with the resulting keyword and the full ciphertext."
      ],
      "prompt": "Submit the full decoded transmission, including the route-key announcement.",
      "code": "HWASSNVPTZMXPIAALVTWJAIBGGXZTRTIASEO",
      "digest": "5da74b62218c3cc113f19fff84a971ac025e4e26dafdafce11432d85e115a7de"
    },
    {
      "title": "Parallax window",
      "algorithm": "Vigen\u00e8re",
      "brief": "Use the route keyword recovered above. A longer keyword protects a complete blackout instruction; a partial phrase will not authenticate.",
      "evidence": "KEY SOURCE: ROUTE KEY IN PREVIOUS MESSAGE\nALPHABET: A \u2026 Z / SPACES REMOVED",
      "hints": [
        "Locate ROUTE KEY IS in the previous result and take the word that follows it.",
        "Decode the complete ciphertext with that keyword. Vigen\u00e8re repeats the key from the beginning; it does not reverse it."
      ],
      "prompt": "Submit the full blackout instruction.",
      "code": "IHVBWLCHDUKBPRIKHWYEYEHBAAJTDLTBALZTPNRLHSVSESEEDRZZZY",
      "digest": "72e409f0c2c7ef9b65196f2743885fa4677f871e08a09eec3db111755af6e31c"
    }
  ],
  [
    {
      "title": "The broken chronology",
      "algorithm": "Vigen\u00e8re",
      "brief": "The log is out of order. Put its four fragments in chronological order, concatenate them into one keyword, then decrypt the Vigen\u00e8re transmission.",
      "evidence": "04:19 \u2014 LA\n04:03 \u2014 OBSI\n04:14 \u2014 NEBU\n04:07 \u2014 DIAN\nKEY RULE: EARLIEST FRAGMENT FIRST",
      "hints": [
        "Sort the timestamps from earliest to latest. Keep each attached fragment intact.",
        "Concatenate all four fragments without spaces. The resulting 14-letter keyword opens this layer."
      ],
      "prompt": "Submit the full decoded message containing both the inner and outer keywords.",
      "code": "WOFMUSELVWBMERCMSJHWUGRVLYJIGOGKWCRAR",
      "digest": "19cc9e6c884cbbdca3bc68a2903c4b43d072905a24438e346a35bd75098b720e"
    },
    {
      "title": "The double Vigen\u00e8re seal",
      "algorithm": "Vigen\u00e8re",
      "brief": "The sender applied Vigen\u00e8re twice: first with the INNER keyword, then with the OUTER keyword. Both are in your previous result. Recover the complete archive instruction in Cipher Lab.",
      "evidence": "METHOD: VIGEN\u00c8RE AT BOTH LAYERS\nKEY ALIGNMENT: POSITION ZERO IN EACH PASS\nNO PADDING / ALL CHARACTERS BELONG TO THE MESSAGE",
      "hints": [
        "Decode the entire ciphertext with the OUTER keyword. Keep the intermediate result even if it is not readable.",
        "Use the intermediate result as input, then decode with the INNER keyword. Submit the complete final message."
      ],
      "prompt": "Submit the complete archive-opening instruction. An intermediate ciphertext is not the final answer.",
      "code": "GNZKZEUNMSIBPSQAVWPEUMNDBCITEDWFMGKXXXCJOSJYMSXFHKNGBVGA",
      "digest": "e19791390994a882e364e461b646c8ee0558fc983ee9d3f968830f5d54c5781b"
    }
  ]
];
