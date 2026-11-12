export const campaignStages = [
  [
    {
      "title": "Silent orbit",
      "algorithm": "Vigen\u00e8re",
      "brief": "The relay uses a repeating alphabetic key. Its operators left a five-line log. Read what leads; decode the entire transmission.",
      "evidence": "Outbound carrier stable.\nRelay is unattended.\nBeacon lost at dusk.\nInbound traffic repeats.\nTracking remains active.",
      "hints": [
        "The first character of each log line matters.",
        "Read the initials top to bottom; use the resulting word as a Vigen\u00e8re keyword."
      ],
      "prompt": "Submit the full decoded sentence, including the relay-key announcement.",
      "code": "FVMIRYVZQLJVDBHF",
      "digest": "6b6def52c10a69c6fea58a9d55d8b7b8c6b351f7003ecacb638a33773dbbb4bd"
    },
    {
      "title": "The shuffled rendezvous",
      "algorithm": "Columnar",
      "brief": "Use the relay key recovered in stage 1. The sender filled a rectangle left to right, then transmitted columns in alphabetical keyword order.",
      "evidence": "ROW-WISE FILL / ALPHABETICAL COLUMN READOUT\nUnused cells are padded with X.",
      "hints": [
        "The keyword is the final word of your previous decoded transmission.",
        "Give each sorted keyword letter one equal-length ciphertext column. Restore the original column order, then read rows."
      ],
      "prompt": "Submit the rendezvous instruction. Remove trailing X padding.",
      "code": "NUREEOOTEAHXZTGXDSTXRVNA",
      "digest": "2ee1da0402404a2ec03300ea8724e5ba01ae9065fc552f5b80cef8c72a6ab208"
    }
  ],
  [
    {
      "title": "The unsigned packet",
      "algorithm": "XOR hex",
      "brief": "The packet is hexadecimal, encrypted with a repeating ASCII key. Four diagnostic lines survived. The key keeps its uppercase form.",
      "evidence": "Network appears empty.\nObservers report interference.\nVectors remain unstable.\nAccess is intermittent.",
      "hints": [
        "Look at the beginning of each diagnostic line.",
        "Use those four initials as a repeating XOR key. Each hex pair is one byte. XOR is its own inverse."
      ],
      "prompt": "Submit the full decoded packet. Preserve the recovered route key for stage 2.",
      "code": "1c 00 03 15 0b 04 13 18 07 1c 06 09 0f 01 02 0e 03",
      "digest": "48bc9d6c856d6e6ae7706ebb85369655eea686dbeb69c95c1e3be621d9012a22"
    },
    {
      "title": "Phantom schedule",
      "algorithm": "Vigen\u00e8re",
      "brief": "The packet revealed a route key. Use it to reverse this repeating-key substitution and recover the blackout schedule.",
      "evidence": "A=0 \u2026 Z=25 / KEY REPEATS / SPACES REMOVED",
      "hints": [
        "The final word of the decoded packet is your next keyword.",
        "Vigen\u00e8re decryption subtracts the repeating key letter from each ciphertext letter, modulo 26."
      ],
      "prompt": "Submit the complete blackout instruction.",
      "code": "QSAPDCGIIETBBEPAZRKCTDBR",
      "digest": "0738c1684fcf0fc31d14194c89755638c84cf20d0e66294a47733d341ffcd0ec"
    }
  ],
  [
    {
      "title": "A fractured spectrum",
      "algorithm": "Rail Fence",
      "brief": "A zigzag transmission crosses 2\u00b2 rails. Start at the top, move downward, and bounce at the edges. The sender concatenated rails from top to bottom.",
      "evidence": "TRACK HEIGHT: 2\u00b2\nDIRECTION: DOWN FIRST\nREADOUT: TOP TO BOTTOM",
      "hints": [
        "2\u00b2 determines the number of rails. Draw the zigzag before filling it.",
        "Count how many positions belong to each rail, split the ciphertext accordingly, then follow the zigzag."
      ],
      "prompt": "Submit the full decoded vault-key announcement.",
      "code": "VEEAKYPCMUTISTULSR",
      "digest": "d753cead86150dbf4382ac4fe27c2d1b62024c30781f738db8ea5899fe265c74"
    },
    {
      "title": "The double seal",
      "algorithm": "Layered cipher",
      "brief": "Two seals protect the archive. The sender FIRST used Vigen\u00e8re with the vault key recovered above, THEN a columnar transposition. A five-letter object that splits white light names the outer key.",
      "evidence": "INNER: REPEATING ALPHABETIC KEY\nOUTER: ROW-WISE FILL / ALPHABETICAL COLUMNS\nPAYLOAD: 21 LETTERS / OUTER PADDING: 4 X CHARACTERS",
      "hints": [
        "Undo the last encryption first. The optical object is the columnar keyword.",
        "The outer keyword is PRISM. Restore its columns, then decrypt Vigen\u00e8re with the key from stage 1."
      ],
      "prompt": "Submit the complete archive-opening instruction.",
      "code": "IUXSXKTMYXLTSMGWBRLXCNEEX",
      "digest": "9277a81cd348d0ada9ab5fb17ec76b7fc29c68adf5bdc049aa4c51aa30de5bde"
    }
  ]
];
