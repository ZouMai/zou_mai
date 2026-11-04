// Positions, repères et consignes de lichess-org/lila, AGPL-3.0-or-later.
export default [
  {
    "key": "rook",
    "title": "La tour",
    "sub": "Elle se déplace sur une ligne droite",
    "levels": [
      {
        "fen": "8/8/8/8/8/8/4R3/8 w - -",
        "goal": "Cliquer sur la tour et la déplacer jusqu’à l’étoile!",
        "stars": "e7",
        "par": 1,
        "guides": [
          [
            "e2e7",
            "green"
          ]
        ]
      },
      {
        "fen": "8/2R5/8/8/8/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "c5 g5",
        "par": 2,
        "guides": [
          [
            "c7c5",
            "green"
          ],
          [
            "c5g5",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/3R4/8/8/8 w - -",
        "goal": "Moins vous effectuez de déplacements, plus vous gagnez de points !",
        "stars": "a4 g3 g4",
        "par": 3
      },
      {
        "fen": "7R/8/8/8/8/8/8/8 w - -",
        "goal": "Moins vous effectuez de déplacements, plus vous gagnez de points !",
        "stars": "f8 g1 g7 g8 h7",
        "par": 5
      },
      {
        "fen": "8/1R6/8/8/3R4/8/8/8 w - -",
        "goal": "Utiliser 2 Tours pour collecter toutes les étoiles !",
        "stars": "a4 g3 g7 h4",
        "par": 4
      },
      {
        "fen": "8/8/8/8/8/5R2/8/R7 w - -",
        "goal": "Utiliser 2 Tours pour collecter toutes les étoiles !",
        "stars": "b7 d1 d5 f2 f7 g4 g7",
        "par": 7
      }
    ]
  },
  {
    "key": "bishop",
    "title": "Le Fou",
    "sub": "Il se déplace en diagonale",
    "levels": [
      {
        "fen": "8/8/8/8/8/5B2/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "d5 g8",
        "par": 2,
        "guides": [
          [
            "f3d5",
            "green"
          ],
          [
            "d5g8",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/8/1B6/8/8 w - -",
        "goal": "Moins vous effectuez de déplacements, plus vous gagnez de points !",
        "stars": "a2 b1 b5 d1 d3 e2",
        "par": 6
      },
      {
        "fen": "8/8/8/8/3B4/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a1 b6 c1 e3 g7 h6",
        "par": 6
      },
      {
        "fen": "8/8/8/8/2B5/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a4 b1 b3 c2 d3 e2",
        "par": 6
      },
      {
        "fen": "8/8/8/8/8/8/8/2B2B2 w - -",
        "goal": "Un fou de cases blanches, Un fou de cases noires. Vous avez besoin des deux !",
        "stars": "d3 d4 d5 e3 e4 e5",
        "par": 6
      },
      {
        "fen": "8/3B4/8/8/8/2B5/8/8 w - -",
        "goal": "Un fou de cases blanches, Un fou de cases noires. Vous avez besoin des deux !",
        "stars": "a3 c2 e7 f5 f6 g8 h4 h7",
        "par": 11
      }
    ]
  },
  {
    "key": "queen",
    "title": "La dame",
    "sub": "Dame = tour + fou",
    "levels": [
      {
        "fen": "8/8/8/8/8/8/4Q3/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "e5 b8",
        "par": 2,
        "guides": [
          [
            "e2e5",
            "green"
          ],
          [
            "e5b8",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/3Q4/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a3 f2 f8 h3",
        "par": 4
      },
      {
        "fen": "8/8/8/8/2Q5/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a3 d6 f1 f8 g3 h6",
        "par": 6
      },
      {
        "fen": "8/6Q1/8/8/8/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a2 b5 d3 g1 g8 h2 h5",
        "par": 7
      },
      {
        "fen": "8/8/8/8/8/8/8/4Q3 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "a6 d1 f2 f6 g6 g8 h1 h4",
        "par": 9
      }
    ]
  },
  {
    "key": "king",
    "title": "Le Roi",
    "sub": "La pièce la plus importante",
    "levels": [
      {
        "fen": "8/8/8/8/8/3K4/8/8 w - -",
        "goal": "Le Roi se déplace lentement.",
        "stars": "e6",
        "par": 3,
        "guides": [
          [
            "d3d4",
            "green"
          ],
          [
            "d4d5",
            "green"
          ],
          [
            "d5e6",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/8/8/8/4K3 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "c2 d3 e2 e3",
        "par": 4
      },
      {
        "fen": "8/8/8/4K3/8/8/8/8 w - -",
        "goal": "Le dernier !",
        "stars": "b5 c5 d6 e3 f3 g4",
        "par": 8
      }
    ]
  },
  {
    "key": "knight",
    "title": "Le Cavalier",
    "sub": "Il se déplace en forme de L",
    "levels": [
      {
        "fen": "8/8/8/8/4N3/8/8/8 w - -",
        "goal": "Les Cavaliers possèdent une façon élégante de sauter partout !",
        "stars": "c5 d7",
        "par": 2,
        "guides": [
          [
            "e4c5",
            "green"
          ],
          [
            "c5d7",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/8/8/8/1N6 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "c3 d4 e2 f3 f7 g5 h8",
        "par": 8
      },
      {
        "fen": "8/2N5/8/8/8/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "b6 d5 d7 e6 f4",
        "par": 5
      },
      {
        "fen": "8/8/8/8/5N2/8/8/8 w - -",
        "goal": "Les Cavaliers peuvent sauter par dessus les obstacles pour collecter les étoiles !",
        "stars": "e3 e4 e5 f3 f5 g3 g4 g5",
        "par": 9
      },
      {
        "fen": "8/8/8/8/8/3N4/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "c3 e2 e4 f2 f4 g6",
        "par": 6
      },
      {
        "fen": "8/2N5/8/8/8/8/8/8 w - -",
        "goal": "Collectez toutes les étoiles !",
        "stars": "b4 b5 c6 c8 d4 d5 e3 e7 f5",
        "par": 9
      }
    ]
  },
  {
    "key": "pawn",
    "title": "Le pion",
    "sub": "Il se déplace uniquement vers l’avant",
    "levels": [
      {
        "fen": "8/8/8/P7/8/8/8/8 w - -",
        "goal": "Les pions avancent d’une case vers l’avant uniquement. Mais, lorsqu’ils atteignent le bord opposé de l’échiquier, ils deviennent une pièce plus puissante : c’est une promotion !",
        "stars": "f3",
        "par": 4,
        "guides": [
          [
            "a5a6",
            "green"
          ],
          [
            "a6a7",
            "green"
          ],
          [
            "a7a8",
            "green"
          ],
          [
            "a8f3",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/5P2/8/8/8/8 w - -",
        "goal": "La plupart du temps, la promotion en Dame est la plus avantageuse. Mais, parfois, une promotion en Cavalier peut s’avérer utile !",
        "stars": "b6 c4 d7 e5 a8",
        "par": 8
      },
      {
        "fen": "8/8/8/8/8/4P3/8/8 w - -",
        "goal": "Les pions se déplacent vers l’avant, mais capturent en diagonale !",
        "stars": "c6 d5 d7",
        "par": 4,
        "guides": [
          [
            "e3e4",
            "green"
          ],
          [
            "e4d5",
            "green"
          ],
          [
            "d5c6",
            "green"
          ],
          [
            "c6d7",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/8/8/8/1P6/8/8 w - -",
        "goal": "Capturez, puis effectuez une promotion !",
        "stars": "b4 b6 c4 c6 c7 d6",
        "par": 8
      },
      {
        "fen": "8/8/8/8/8/3P4/8/8 w - -",
        "goal": "Capturez, puis effectuez une promotion !",
        "stars": "c4 b5 b6 d5 d7 e6 c8",
        "par": 8
      },
      {
        "fen": "8/8/8/8/8/P1PP3P/8/8 w - -",
        "goal": "Utilisez tous vos pions ! Inutile d’effectuer des promotions.",
        "stars": "b5 c5 d4 e5 g4",
        "par": 7
      },
      {
        "fen": "8/8/8/8/8/8/4P3/8 w - -",
        "goal": "Un pion sur sa case de départ peut se déplacer initialement de 2 cases d’un coup !",
        "stars": "d6",
        "par": 3,
        "guides": [
          [
            "e2e4",
            "green"
          ]
        ],
        "highlightRank": 2
      },
      {
        "fen": "8/8/8/8/8/8/2PPPP2/8 w - -",
        "goal": "Collecter toutes les étoiles ! Inutile d’effectuer des promotions.",
        "stars": "c5 d5 e5 f5 d3 e4",
        "par": 9
      }
    ]
  },
  {
    "key": "capture",
    "title": "Capturer",
    "sub": "Prenez les pièces adverses",
    "levels": [
      {
        "fen": "8/2p2p2/8/8/8/2R5/8/8 w - -",
        "goal": "Prenez les pièces noires !",
        "par": 2,
        "guides": [
          [
            "c3c7",
            "green"
          ],
          [
            "c7f7",
            "green"
          ]
        ]
      },
      {
        "fen": "8/2r2p2/8/8/5Q2/8/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 2,
        "guides": [
          [
            "f4c7",
            "green"
          ],
          [
            "f4f7",
            "red"
          ],
          [
            "c7f7",
            "yellow"
          ]
        ]
      },
      {
        "fen": "8/5r2/8/1r3p2/8/3B4/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 5
      },
      {
        "fen": "8/5b2/5p2/3n2p1/8/6Q1/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 7
      },
      {
        "fen": "8/3b4/2p2q2/8/3p1N2/8/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 6
      }
    ]
  },
  {
    "key": "protection",
    "title": "Protéger",
    "sub": "Assurez la sécurité de vos pièces",
    "levels": [
      {
        "fen": "8/8/8/4bb2/8/8/P2P4/R2K4 w - -",
        "goal": "Vous êtes attaqué ! Fuyez la menace !",
        "par": 1,
        "guides": [
          [
            "e5a1",
            "red"
          ],
          [
            "a1c1",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/2q2N2/8/8/8/8/8 w - -",
        "goal": "Vous êtes attaqué ! Fuyez la menace !",
        "par": 1
      },
      {
        "fen": "8/N2q4/8/8/8/8/6R1/8 w - -",
        "goal": "Il n’y a pas d’échappatoire, mais vous pouvez vous défendre !",
        "par": 1,
        "seq": [
          "g2a2"
        ],
        "guides": [
          [
            "a2a7",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/1Bq5/8/2P5/8/8/8 w - -",
        "goal": "Il n’y a pas d’échappatoire, mais vous pouvez vous défendre !",
        "par": 1
      },
      {
        "fen": "1r6/8/5b2/8/8/5N2/P2P4/R1B5 w - -",
        "goal": "Il n’y a pas d’échappatoire, mais vous pouvez vous défendre !",
        "par": 1,
        "guides": [
          [
            "f6a1",
            "red"
          ],
          [
            "d2d4",
            "green"
          ]
        ]
      },
      {
        "fen": "8/1b6/8/8/8/3P2P1/5NRP/r7 w - -",
        "goal": "Ne laissez pas l’adversaire prendre une pièce non défendue !",
        "par": 1
      },
      {
        "fen": "rr6/3q4/4n3/4P1B1/7P/P7/1B1N1PP1/R5K1 w - -",
        "goal": "Ne laissez pas l’adversaire prendre une pièce non défendue !",
        "par": 1
      },
      {
        "fen": "8/3q4/8/1N3R2/8/2PB4/8/8 w - -",
        "goal": "Ne laissez pas l’adversaire prendre une pièce non défendue !",
        "par": 1
      }
    ]
  },
  {
    "key": "combat",
    "title": "Combat",
    "sub": "Capturez et défendez les pièces",
    "levels": [
      {
        "fen": "8/8/8/8/P2r4/6B1/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 3,
        "guides": [
          [
            "a4a5",
            "green"
          ],
          [
            "g3f2",
            "green"
          ],
          [
            "f2d4",
            "green"
          ],
          [
            "d4a4",
            "yellow"
          ]
        ]
      },
      {
        "fen": "2r5/8/3b4/2P5/8/1P6/2B5/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 4
      },
      {
        "fen": "1r6/8/5n2/3P4/4P1P1/1Q6/8/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 4
      },
      {
        "fen": "2r5/8/3N4/5b2/8/8/PPP5/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 4
      },
      {
        "fen": "8/6q1/8/4P1P1/8/4B3/r2P2N1/8 w - -",
        "goal": "Prenez les pièces noires ! Et ne perdez pas les vôtres.",
        "par": 8
      }
    ]
  },
  {
    "key": "check1",
    "title": "Échec en un coup",
    "sub": "Attaquez le Roi adverse",
    "levels": [
      {
        "fen": "4k3/8/2b5/8/8/8/8/R7 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1,
        "guides": [
          [
            "a1e1",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/4k3/3n4/8/1Q6/8/8 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      },
      {
        "fen": "3qk3/1pp5/3p4/4p3/8/3B4/6r1/8 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      },
      {
        "fen": "2r2q2/2n5/8/4k3/8/2N1P3/3P2B1/8 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      },
      {
        "fen": "8/2b1q2n/1ppk4/2N5/8/8/8/8 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      },
      {
        "fen": "6R1/1k3r2/8/4Q3/8/2n5/8/8 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      },
      {
        "fen": "7r/4k3/8/3n4/4N3/8/2R5/4Q3 w - -",
        "goal": "Menacez le Roi adverse en un coup !",
        "par": 1
      }
    ]
  },
  {
    "key": "outOfCheck",
    "title": "Parer un échec",
    "sub": "Défendez votre Roi",
    "levels": [
      {
        "fen": "8/8/8/4q3/8/8/8/4K3 w - -",
        "goal": "Faites fuir votre Roi !",
        "par": 1,
        "guides": [
          [
            "e5e1",
            "red"
          ],
          [
            "e1f1",
            "green"
          ]
        ]
      },
      {
        "fen": "8/2n5/5b2/8/2K5/8/2q5/8 w - -",
        "goal": "Faites fuir votre Roi !",
        "par": 1
      },
      {
        "fen": "8/7r/6r1/8/R7/7K/8/8 w - -",
        "goal": "Le Roi ne peut pas s’échapper, mais vous pouvez parer l’attaque !",
        "par": 1
      },
      {
        "fen": "8/8/8/3b4/8/4N3/KBn5/1R6 w - -",
        "goal": "Vous pouvez parer l’échec en prenant la pièce attaquante.",
        "par": 1
      },
      {
        "fen": "4q3/8/8/8/8/5nb1/3PPP2/3QKBNr w - -",
        "goal": "Ce Cavalier donne un échec à travers vos défenses !",
        "par": 1
      },
      {
        "fen": "8/8/7p/2q5/5n2/1N1KP2r/3R4/8 w - -",
        "goal": "Fuyez avec le Roi ou bloquez l’attaque !",
        "par": 1
      },
      {
        "fen": "8/6b1/8/8/q4P2/2KN4/3P4/8 w - -",
        "goal": "Fuyez avec le Roi ou bloquez l’attaque !",
        "par": 1
      }
    ]
  },
  {
    "key": "checkmate1",
    "title": "Mat en un coup",
    "sub": "Matez le Roi adverse",
    "levels": [
      {
        "fen": "3qk3/3ppp2/8/8/2B5/5Q2/8/8 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1,
        "guides": [
          [
            "f3f7",
            "green"
          ]
        ]
      },
      {
        "fen": "6rk/6pp/7P/6N1/8/8/8/8 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1
      },
      {
        "fen": "R7/8/7k/2r5/5n2/8/6Q1/8 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1
      },
      {
        "fen": "2rb4/2k5/5N2/1Q6/8/8/8/8 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1
      },
      {
        "fen": "1r2kb2/ppB1p3/2P2p2/2p1N3/B7/8/8/3R4 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1
      },
      {
        "fen": "8/pk1N4/n7/b7/6B1/1r3b2/8/1RR5 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1,
        "seq": [
          "g4f3"
        ],
        "guides": [
          [
            "b1b7",
            "yellow"
          ],
          [
            "f3b7",
            "yellow"
          ]
        ]
      },
      {
        "fen": "r1b5/ppp5/2N2kpN/5q2/8/Q7/8/4B3 w - -",
        "goal": "Attaquez le Roi de votre adversaire de manière qu’il ne puisse pas être défendu !",
        "par": 1
      }
    ]
  },
  {
    "key": "setup",
    "title": "Position de départ",
    "sub": "Comment une partie débute",
    "levels": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - -",
        "goal": "Cela est la position initiale de toute partie d’échecs ! Faites un coup pour continuer.",
        "par": 1
      },
      {
        "fen": "r6r/pppppppp/8/8/8/8/8/2RR4 w - -",
        "goal": "Placez tout d’abord les Tours ! Elles se placent dans les coins.",
        "stars": "a1 h1",
        "par": 2,
        "place": "r",
        "guides": [
          [
            "c1a1",
            "green"
          ],
          [
            "d1h1",
            "green"
          ]
        ]
      },
      {
        "fen": "rn4nr/pppppppp/8/8/8/8/2NN4/R6R w - -",
        "goal": "Placez ensuite les Cavaliers ! Ils se placent à côté des Tours.",
        "stars": "b1 g1",
        "par": 4,
        "place": "n"
      },
      {
        "fen": "rnb2bnr/pppppppp/8/8/4BB2/8/8/RN4NR w - -",
        "goal": "Placez les fous ! Ils se placent à côté des cavaliers.",
        "stars": "c1 f1",
        "par": 4,
        "place": "b"
      },
      {
        "fen": "rnbq1bnr/pppppppp/8/8/5Q2/8/8/RNB2BNR w - -",
        "goal": "Placez la Dame ! Elle se place sur sa propre couleur.",
        "stars": "d1",
        "par": 2,
        "place": "q"
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/5K2/8/8/RNBQ1BNR w - -",
        "goal": "Placez le Roi ! Il se place à côté de sa Dame.",
        "stars": "e1",
        "par": 3,
        "place": "k"
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - -",
        "goal": "Les pions forment la ligne de front. Jouez un coup pour continuer.",
        "par": 1,
        "highlightRank": 2
      }
    ]
  },
  {
    "key": "castling",
    "title": "Le roque",
    "sub": "Le coup spécial du Roi",
    "levels": [
      {
        "fen": "rnbqkbnr/pppppppp/8/8/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
        "goal": "Bougez votre Roi de deux cases pour faire le petit roque !",
        "par": 1,
        "castle": "O-O",
        "guides": [
          [
            "e1g1",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/1PN5/PBPPQPPP/R3KBNR w KQkq -",
        "goal": "Bougez votre Roi de deux cases pour faire le grand roque !",
        "par": 1,
        "castle": "O-O-O",
        "guides": [
          [
            "e1c1",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/4P3/PPPPBPPP/RNBQK1NR w KQkq -",
        "goal": "Le Cavalier empêche le roque ! Bougez-le puis faites le petit roque.",
        "par": 2,
        "castle": "O-O",
        "guides": [
          [
            "e1g1",
            "green"
          ],
          [
            "g1f3",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
        "goal": "Faites le petit roque ! Vous devez d’abord sortir les pièces.",
        "par": 4,
        "castle": "O-O",
        "guides": [
          [
            "e1g1",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
        "goal": "Faites le grand roque ! Vous devez d’abord sortir les pièces.",
        "par": 6,
        "castle": "O-O-O",
        "guides": [
          [
            "e1c1",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/1PN1PN2/PBPQBPPP/R3K1R1 w Qkq -",
        "goal": "Vous ne pouvez pas roquer si le roi a déjà bougé ou si la tour a déjà bougé.",
        "par": 1,
        "castle": "O-O-O",
        "guides": [
          [
            "e1g1",
            "red"
          ],
          [
            "e1c1",
            "green"
          ]
        ]
      },
      {
        "fen": "rn1qkbnr/ppp1pppp/3p4/8/2b5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
        "goal": "Vous ne pouvez pas roquer si le Roi est en échec. Parez l’échec puis roquez !",
        "par": 2,
        "castle": "O-O",
        "guides": [
          [
            "c4f1",
            "red"
          ],
          [
            "e1",
            "green"
          ],
          [
            "f1",
            "green"
          ],
          [
            "g1",
            "green"
          ]
        ]
      },
      {
        "fen": "rnb2rk1/pppppppp/8/8/8/4Nb1n/PPPP1P1P/RNB1KB1R w KQkq -",
        "goal": "Trouvez un moyen d’effectuer le petit roque !",
        "par": 2,
        "castle": "O-O",
        "guides": [
          [
            "e1g1",
            "green"
          ]
        ]
      },
      {
        "fen": "1r1k2nr/p2ppppp/7b/7b/4P3/2nP4/P1P2P2/RN2K3 w Q -",
        "goal": "Trouvez un moyen d’effectuer le grand roque !",
        "par": 4,
        "castle": "O-O-O",
        "guides": [
          [
            "e1c1",
            "green"
          ]
        ]
      }
    ]
  },
  {
    "key": "enpassant",
    "title": "Prise en passant",
    "sub": "Le coup spécial du pion",
    "levels": [
      {
        "fen": "rnbqkbnr/pppppppp/8/2P5/8/8/PP1PPPPP/RNBQKBNR b KQkq -",
        "goal": "Les Noirs viennent juste de bouger un pion de deux cases ! Prenez-le en passant.",
        "par": 1,
        "seq": [
          "d7d5",
          "c5d6"
        ],
        "guides": [
          [
            "c5d6",
            "green"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/ppp1pppp/8/2Pp3P/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
        "goal": "La prise en passant ne peut être effectuée qu’immédiatement après que l’adversaire ait bougé le pion.",
        "par": 1,
        "seq": [
          "g7g5",
          "h5g6"
        ],
        "guides": [
          [
            "h5g6",
            "green"
          ],
          [
            "c5d6",
            "red"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/P7/2P5/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
        "goal": "La prise en passant ne peut être effectuée que si votre pion se trouve sur la 5e rangée.",
        "par": 1,
        "seq": [
          "b7b5",
          "c5b6"
        ],
        "guides": [
          [
            "c5b6",
            "green"
          ],
          [
            "a6b7",
            "red"
          ]
        ]
      },
      {
        "fen": "rnbqkbnr/pppppppp/8/2PPP2P/8/8/PP1P1PP1/RNBQKBNR b KQkq -",
        "goal": "Prenez tous les pions en passant !",
        "par": 4,
        "seq": [
          "b7b5",
          "c5b6",
          "f7f5",
          "e5f6",
          "c7c5",
          "d5c6",
          "g7g5",
          "h5g6"
        ]
      }
    ]
  },
  {
    "key": "stalemate",
    "title": "Pat",
    "sub": "La partie est nulle",
    "levels": [
      {
        "fen": "k7/8/8/6B1/8/1R6/8/8 w - -",
        "goal": "Le pat noir : - Les Noirs ne peuvent jouer aucun coup - Les Noirs ne sont pas en échec.",
        "par": 1,
        "seq": [
          "g5e3"
        ],
        "guides": [
          [
            "g5e3",
            "green"
          ]
        ]
      },
      {
        "fen": "8/7p/4N2k/8/8/3N4/8/1K6 w - -",
        "goal": "Le pat noir : - Les Noirs ne peuvent jouer aucun coup - Les Noirs ne sont pas en échec.",
        "par": 1,
        "seq": [
          "d3f4"
        ],
        "guides": [
          [
            "e6g7",
            "blue"
          ],
          [
            "e6g5",
            "blue"
          ],
          [
            "f4g6",
            "blue"
          ],
          [
            "f4h5",
            "blue"
          ],
          [
            "g7",
            "blue"
          ],
          [
            "g5",
            "blue"
          ],
          [
            "g6",
            "blue"
          ],
          [
            "h5",
            "blue"
          ]
        ]
      },
      {
        "fen": "4k3/6p1/5p2/p4P2/PpB2N2/1K6/8/3R4 w - -",
        "goal": "Le pat noir : - Les Noirs ne peuvent jouer aucun coup - Les Noirs ne sont pas en échec.",
        "par": 1,
        "seq": [
          "f4g6"
        ],
        "guides": [
          [
            "c4f7",
            "blue"
          ],
          [
            "d1d8",
            "blue"
          ],
          [
            "g6e7",
            "blue"
          ],
          [
            "g6f8",
            "blue"
          ]
        ]
      },
      {
        "fen": "8/6pk/6np/7K/8/3B4/8/1R6 w - -",
        "goal": "Le pat noir : - Les Noirs ne peuvent jouer aucun coup - Les Noirs ne sont pas en échec.",
        "par": 1,
        "seq": [
          "b1b8"
        ],
        "guides": [
          [
            "b8g8",
            "blue"
          ],
          [
            "b8h8",
            "blue"
          ],
          [
            "d3h7",
            "red"
          ],
          [
            "g6e7",
            "red"
          ]
        ]
      },
      {
        "fen": "7R/pk6/p1pP4/K7/3BB2p/7p/1r5P/8 w - -",
        "goal": "Le pat noir : - Les Noirs ne peuvent jouer aucun coup - Les Noirs ne sont pas en échec.",
        "par": 1,
        "seq": [
          "d4b2"
        ],
        "guides": [
          [
            "h8a8",
            "blue"
          ],
          [
            "a5b6",
            "blue"
          ],
          [
            "d6c7",
            "blue"
          ],
          [
            "e4b7",
            "red"
          ],
          [
            "c6c5",
            "red"
          ]
        ]
      }
    ]
  },
  {
    "key": "value",
    "title": "Valeur des pièces",
    "sub": "Évaluer la valeur des pièces",
    "levels": [
      {
        "fen": "8/8/2qrbnp1/3P4/8/8/8/8 w - -",
        "goal": "Prenez la pièce avec la valeur la plus élevée ! Dame &gt; Fou",
        "par": 1,
        "seq": [
          "d5c6"
        ],
        "guides": [
          [
            "d5c6",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/4b3/1p6/6r1/8/4Q3/8 w - -",
        "goal": "Prenez la pièce de plus grande valeur ! N’échangez pas une pièce de valeur supérieure contre une pièce de moindre valeur.",
        "par": 1,
        "seq": [
          "e2e6"
        ]
      },
      {
        "fen": "5b2/8/6N1/2q5/3Kn3/2rp4/3B4/8 w - -",
        "goal": "Prenez la pièce de plus grande valeur ! Assurez-vous que votre déplacement est légal !",
        "par": 1,
        "seq": [
          "d4e4"
        ]
      },
      {
        "fen": "1k4q1/pp6/8/3B4/2P5/1P1p2P1/P3Kr1P/3n4 w - -",
        "goal": "Prenez la pièce avec la valeur la plus élevée !",
        "par": 1,
        "seq": [
          "e2d1"
        ]
      },
      {
        "fen": "7k/3bqp1p/7r/5N2/6K1/6n1/PPP5/R1B5 w - -",
        "goal": "Prenez la pièce avec la valeur la plus élevée !",
        "par": 1,
        "seq": [
          "c1h6"
        ]
      }
    ]
  },
  {
    "key": "check2",
    "title": "Échec en deux coups",
    "sub": "Mettez échec en deux coups",
    "levels": [
      {
        "fen": "2k5/2pb4/8/2R5/8/8/8/8 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2,
        "guides": [
          [
            "c5a5",
            "green"
          ],
          [
            "a5a8",
            "green"
          ]
        ]
      },
      {
        "fen": "8/8/5k2/8/8/1N6/5b2/8 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      },
      {
        "fen": "6k1/2r3pp/8/1N6/8/8/4B3/8 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      },
      {
        "fen": "r3k3/7b/8/4B3/8/8/4N3/4R3 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      },
      {
        "fen": "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      },
      {
        "fen": "8/8/8/2k5/q7/4N3/3B4/8 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      },
      {
        "fen": "r6r/1Q2nk2/1B3p2/8/8/8/8/8 w - -",
        "goal": "Menacez le Roi adverse en deux coups !",
        "par": 2
      }
    ]
  }
];
