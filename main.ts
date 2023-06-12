input.onButtonPressed(Button.A, function () {
    // let user either start song, or change tempo 
    if (!(started)) {
        setup()
    } else {
        // let user can change tempo with buttons 
        music.changeTempoBy(-20)
        showTempo()
    }
})

input.onButtonPressed(Button.B, function () {
    // let user either choose song, or change tempo 
    if (!(started)) {
        song += 1
        if (song > songChars.length - 1) {
            song = 1
        }
        basic.showString(songChars[song], 40)
    } else {
        music.changeTempoBy(20)
        showTempo()
    }
})

function showTempo() {
    basic.clearScreen()
    basic.showNumber(music.tempo(), 40)
    showBG()
}

function showBG() {
    // show sequence dot 
    for (let dot = 0; dot <= seqLen - 1; dot++) {
        led.plotBrightness(dot % 5, dot / 5, dim)
    }

    // show chord dot 
    for (let dot2 = 0; dot2 <= numChords - 1; dot2++) {
        led.plotBrightness(dot2, 4, dim)
    }
}


// do everthing needed before playing song
function setup() {
    // create sequence strings 
    sequenceC = " "
    sequenceCE = " "
    sequenceAm = " "
    sequenceAmX = " "
    sequenceAmE = " "
    sequenceF = " "
    sequenceFE = " "
    sequenceG = " "
    sequenceGE = " "
    sequenceGX = " "
    sequenceGE = " "
    sequenceEm = " "
    sequenceDm = " "
    sequenceCs = " "
    ost = " "


    seqLen = 16
    if (song >= 11) {
        seqLen = 8
    }

    if (song == 7) { // special short riff 
        seqLen = 4
    }


    if (song == 6) {   // special short riff, with long start-note
        seqLen = 3
    }


    if (song == 4 || song == 16) {  // single riffs 
        numChords = 1
        for (let i = 0; i <= seqLen - 1; i++) {
            sNote = randint(0, Cscale.length - 1)
            sequenceCs += Cscale[sNote]

            if (song >= 11) {  // 8-note seqs
                sequenceCs += ":8"
            }

            sequenceCs += " "
        }
    } else {
        for (let j = 0; j <= seqLen - 1; j++) {
            sNote = randint(0, CMnotes.length - 1)
            sequenceC += CMnotes[sNote] + " "

            if (song == 12) {
                sNote = randint(0, FMnotes.length - 1) // a diffrent pattern 
            }
            sequenceF += FMnotes[sNote] + " "

            if (song == 12) {
                sNote = randint(0, GMnotes.length - 1)// a diffrent pattern 
            }
            sequenceG += GMnotes[sNote] + " "


            sequenceAm += AmNotes[sNote] + " "
            sequenceEm += EmNotes[sNote] + " "
            sequenceDm += DmNotes[sNote] + " "
        }
    }

    basic.clearScreen()

    if (song == 3) {
        numChords = 2
        for (let k = 0; k <= seqLen - 1; k++) {
            sNote = randint(0, AmXNotes.length - 1)
            sequenceAmX += AmXNotes[sNote] + " "
            sequenceGX += GXnotes[sNote] + " "
        }
    }


    // echoing notes 
    for (let l = 0; l <= ((seqLen - 1) / 2); l++) {
        sNote = randint(2, CMnotes.length - 1)
        sequenceGE += GMnotes[sNote] + " "
        sequenceGE += GMnotes[sNote] + " "
        sequenceCE += CMnotes[sNote] + " "
        sequenceCE += CMnotes[sNote] + " "
        sequenceFE += FMnotes[sNote] + " "
        sequenceFE += FMnotes[sNote] + " "
    }





    // ostinato 
    if (song == 9) {
        numChords = 2
        seqLen = 15
        for (let m = 0; m < 14; m++) {
            sNote = randint(0, Oscale.length)
            ost += Oscale[sNote] + ":4 "
        }
    }



    // Walkdown-bass
    if (song == 13) {
        seqLen = 7
        for (let m = 0; m < 6; m++) {
            sNote = randint(0, Oscale.length)
            ost += Oscale[sNote] + ":4 "
        }
    }

    showBG()
    started = true
}



// do actions for each note 

music.onEvent(MusicEvent.MelodyNotePlayed, function () {

    // reset bright dots 
    led.plotBrightness(noteCounter % 5, noteCounter / 5, dim)
    led.plotBrightness(chordCounter, 4, dim)

    noteCounter += 1
    if (noteCounter >= seqLen) {
        noteCounter = 0
        chordCounter += 1
        music.setVolume(volH)   // full volume for first note in seq 
    } else {
        if (song == 7) {
            music.setVolume(volM)  // lower volume for non-first note in seq 
        }
    }

    if (song == 8) {  // echo notes 
        music.setTempo(600)
        if ((noteCounter % 2) == 1) {
            music.setVolume(volM)   //  volume for echo 
        } else {
            music.setVolume(volH)  //  volume for note 
        }
    }


    if (chordCounter >= numChords) {
        chordCounter = 0
    }

    // light new dots 
    led.plotBrightness(noteCounter % 5, noteCounter / 5, 255)
    led.plotBrightness(chordCounter, 4, 255)

    // trigger drums via pins
    if (noteCounter % 4 == 0) {
        pins.digitalWritePin(DigitalPin.P1, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P1, 0)
    }

    if (noteCounter % 2 == 0) {
        pins.digitalWritePin(DigitalPin.P2, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P2, 0)
    }
})

let chordCounter = 0
let noteCounter = 0
let sNote = 0
let seqLen = 0
let started = false
let songChars: string[] = []
let song = 0
let dim = 0
let DmNotes: string[] = []
let EmNotes: string[] = []
let GXnotes: string[] = []
let GMnotes: string[] = []
let FMnotes: string[] = []
let CMnotes: string[] = []
let AmXNotes: string[] = []
let AmNotes: string[] = []
let Cscale: string[] = []
let Oscale: string[] = []
let numChords = 0
let sequenceCs = ""
let sequenceCE = ""
let sequenceDm = ""
let sequenceEm = ""
let sequenceGX = ""
let sequenceG = ""
let sequenceGE = ""
let sequenceF = ""
let sequenceFE = ""
let sequenceAmX = ""
let sequenceAm = ""
let sequenceAmE = ""
let sequenceC = ""
let ost = ""

let volH = 255
let volM = volH / 2
let volL = 40
music.setTempo(400)
numChords = 4

Cscale = [
    "C1",
    "D1",
    "E1",
    "F1",
    "G1",
    "A1",
    "B1",
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3",
    "-", "-", "-", "-",
    "-", "-", "-", "-"
]

Oscale = [
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3"
]



AmNotes = [
    "A0",
    "C1",
    "E1",
    "A1",
    "C2",
    "E2",
    "A2",
    "C3",
    "E3"
]

AmXNotes = [
    "A0",
    "A1",
    "B1",
    "C2",
    "D2",
    "E2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "A3",
    "B3"
]

CMnotes = [
    "C1",
    "E1",
    "G1",
    "C2",
    "E2",
    "G2",
    "C3",
    "E3",
    "G3"
]

FMnotes = [
    "F1",
    "A1",
    "C2",
    "F2",
    "A2",
    "C3",
    "F3",
    "A3",
    "C4"
]

GMnotes = [
    "G1",
    "B1",
    "D2",
    "G2",
    "B2",
    "D3",
    "G3",
    "B3",
    "D4"
]

GXnotes = [
    "G1",
    "C2",
    "D2",
    "E2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "G3",
    "A3",
    "B3"
]

EmNotes = [
    "E1",
    "G1",
    "B1",
    "E2",
    "G2",
    "B2",
    "E3",
    "G3",
    "B3"
]
DmNotes = [
    "D1",
    "F1",
    "A1",
    "D2",
    "F2",
    "A2",
    "D3",
    "F3",
    "A3"
]
dim = 255 / 20
song = 1
songChars = [
    " ",
    "a", // Am progression 
    "C", // CAFG 
    "G", // Am G 
    "R", // single long random seq 
    "1", // 1 4 5  
    "L", // long first note 
    "V", // volume change 
    "E", //  echo 
    "O", // ostinato    
    "+", // asc chords 
    "-", // descenting chords 
    "I", // individual patterm for each chord 
    "W",
    "4",
    "5",
    "r" // single short random seq 
]
basic.showString(songChars[song], 40)

basic.forever(function () {
    if (started) {  // aiting for user to press start Button      
        // handle each song 
        // they vary in # notes, # chords, randomness, volume-change, rests 

        // ------------------  16-note songs 

        if (song == 1) {
            // Am F G Am 
            music.playMelody(sequenceAm, music.tempo())
            music.playMelody(sequenceF, music.tempo())
            music.playMelody(sequenceG, music.tempo())
            music.playMelody(sequenceAm, music.tempo())
        }

        if (song == 2) {
            // C Am F G 
            music.playMelody(sequenceC, music.tempo())
            music.playMelody(sequenceAm, music.tempo())
            music.playMelody(sequenceF, music.tempo())
            music.playMelody(sequenceG, music.tempo())
        }

        if (song == 3) {
            // Am G (with extended chord-note-choices) 
            music.playMelody(sequenceAmX, music.tempo())
            music.playMelody(sequenceGX, music.tempo())
        }

        if (song == 4) {
            // random 16-note sequence in C scale (has rests) 
            music.playMelody(sequenceCs, music.tempo())
        }


        if (song == 5) {
            // C F G F 
            music.playMelody(sequenceC, music.tempo())
            music.playMelody(sequenceF, music.tempo())
            music.playMelody(sequenceG, music.tempo())
            music.playMelody(sequenceF, music.tempo())
        }


        if (song == 6) {
            // 3 note seqs; double-length first note each time 
            music.playMelody("C2:8 E2:4  C2", music.tempo())
            music.playMelody("F2:8 A2:4  F2", music.tempo())
            music.playMelody("G2:8 B2:4  G2", music.tempo())
            music.playMelody("F2:8 C3:4  F2", music.tempo())
        }


        if (song == 7) {
            // 4 note seqs; volume-increase on 1st of every 4 
            music.playMelody("C2 E2 G2 C2", music.tempo())
            music.playMelody("F2 A2 C3 F2", music.tempo())
            music.playMelody("G2 B2 D2 G2", music.tempo())
            music.playMelody("F2 C3 A2 F2", music.tempo())
        }


        if (song == 8) {
            // echoed notes 
            music.playMelody(sequenceCE, music.tempo())
            music.playMelody(sequenceGE, music.tempo())
            music.playMelody(sequenceFE, music.tempo())
            music.playMelody(sequenceGE, music.tempo())
        }


        if (song == 9) {
            // ostinato 
            music.playMelody("C2:8 " + ost, music.tempo())
            music.playMelody("F2:8 " + ost, music.tempo())
        }


        if (song == 10) {
            // Am C Dm F (Ascending Am chords) 
            music.playMelody(sequenceAm, music.tempo())
            music.playMelody(sequenceC, music.tempo())
            music.playMelody(sequenceDm, music.tempo())
            music.playMelody(sequenceF, music.tempo())

        }




        // ------------------ 8-note songs 
        if (song == 11) {
            // Am G F Em (falling Am) 
            music.playMelody(sequenceAm, music.tempo())
            music.playMelody(sequenceG, music.tempo())
            music.playMelody(sequenceF, music.tempo())
            music.playMelody(sequenceEm, music.tempo())
        }


        if (song == 12) {
            // different pattern for each chord 
            // C F G F 
            music.playMelody(sequenceC, music.tempo())
            music.playMelody(sequenceF, music.tempo())
            music.playMelody(sequenceG, music.tempo())
            music.playMelody(sequenceF, music.tempo())
        }


        if (song == 13) {
            // Walkdown 
            music.playMelody("C3:8 " + ost, music.tempo())
            music.playMelody("B2:8 " + ost, music.tempo())
            music.playMelody("A2:8 " + ost, music.tempo())
            music.playMelody("G2:8 " + ost, music.tempo())
        }




        if (song == 16) {
            // random 8-note sequence
            music.playMelody(sequenceCs, music.tempo())
        }







    }

})
