input.onButtonPressed(Button.A, function () {
    // let user either start song, or change tempo
    if (!(started)) {
        setup()
    } else {
        // let user can change tempo with buttons
        music.changeTempoBy(-60)
        showTempo()
    }
})
function showTempo() {
    basic.clearScreen()
    basic.showNumber(music.tempo(), 40)
    showBG()
}
function showBG() {
    // show sequence dots
    for (let dot = 0; dot <= seqLen - 1; dot++) {
        led.plotBrightness(dot % 5, dot / 5, dim)
    }
    // show chord dots
    for (let dot2 = 0; dot2 <= numChords - 1; dot2++) {
        led.plotBrightness(dot2, 4, dim)
    }
}
input.onButtonPressed(Button.B, function () {
    // let user either choose song, or change tempo
    if (!(started)) {
        song += 1
        while (songChars[song] == "_") {  // skip blanks
            song += 1
        }
        if (song > songChars.length - 1) {
            song = 1
        }
        basic.showString(songChars[song], 40)
    } else {
        music.changeTempoBy(60)
        showTempo()
    }
})
// do everything needed before playing song
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
    sequenceCs2 = " "
    ost = " "
    seqLen = 16
    if (song >= CUTTOFF) {
        seqLen = 8
    }
    if (song == 7) {
        // special short seq
        seqLen = 4
    }
    


    // how long should it take to play 1 seq, at a faster tempo, so we can then delay it to catch up
    let adjust = 36
    music.changeTempoBy(-adjust)
    seqShouldTake = seqLen * music.beat(BeatFraction.Whole)
    console.log("target BPM=" + music.tempo() / 4)
    music.changeTempoBy(adjust)
    console.log("seq should take:" + seqShouldTake)


    if (song == 6) {
        // special short seq, with long start-note
        seqLen = 3
    }

    if (song == 4 || song == (CUTTOFF+3) || song == 3 || song==18) {
        // single sequence
        numChords = 1


        let notesOut = 0
        let remainingBeats = 4 * seqLen
        for (let i = 0; i <= seqLen - 1; i++) {
            sNote = randint(0, Cscale.length - 1)
            if ((song!=3) && (song!=18)) { // not super-random seq
                sequenceCs = "" + sequenceCs + Cscale[sNote]
                sequenceCs2 = "" + sequenceCs2 + Cscale[randint(0, Cscale.length - 1)]
            }

            if (song >= CUTTOFF) {  // 8-note seqs
                sequenceCs = "" + sequenceCs + ":8"  // double length
            }

            if (song == 3 || song ==18) { // super-random seq
                if (remainingBeats >= 0) {
                    let notelen = 2 ** randint(1, 3)
                    if (notelen >= remainingBeats) {
                        notelen = remainingBeats
                        remainingBeats = 0;
                    } else {
                        remainingBeats -= notelen;
                    }
                    if (notelen > 0) {
                        sequenceCs = "" + sequenceCs + Cscale[sNote] + ":" + notelen  // random length
                        sequenceCs2 = "" + sequenceCs2 + Cscale[randint(0, Cscale.length - 1)] + ":" + notelen  // random length
                        ++notesOut
                    }
                }
            }
            sequenceCs = "" + sequenceCs + " "
            sequenceCs2 = "" + sequenceCs2 + " "
        }
        if (song == 3 || song==18) { // super-random seq
            seqLen = notesOut
        }
    } else {
        for (let j = 0; j <= seqLen - 1; j++) {
            sNote = randint(0, CMnotes.length - 1)
            sequenceC = "" + sequenceC + CMnotes[sNote] + " "
            if (song == (CUTTOFF+1)) {
                // a diffrent pattern
                sNote = randint(0, FMnotes.length - 1)
            }
            sequenceF = "" + sequenceF + FMnotes[sNote] + " "
            // a diffrent pattern
            if (song == (CUTTOFF+1)) {
                sNote = randint(0, GMnotes.length - 1)
            }
            sequenceG = "" + sequenceG + GMnotes[sNote] + " "
            sequenceAm = "" + sequenceAm + AmNotes[sNote] + " "
            sequenceEm = "" + sequenceEm + EmNotes[sNote] + " "
            sequenceDm = "" + sequenceDm + DmNotes[sNote] + " "
        }
    }
    basic.clearScreen()
    if (song == 99) { // this song is not currently used
        numChords = 2
        for (let k = 0; k <= seqLen - 1; k++) {
            sNote = randint(0, AmXNotes.length - 1)
            sequenceAmX = "" + sequenceAmX + AmXNotes[sNote] + " "
            sequenceGX = "" + sequenceGX + GXnotes[sNote] + " "
        }
    }




    // echoing notes
    for (let l = 0; l <= (seqLen - 1) / 2; l++) {
        sNote = randint(2, CMnotes.length - 1)
        sequenceGE = "" + sequenceGE + GMnotes[sNote] + " "
        sequenceGE = "" + sequenceGE + GMnotes[sNote] + " "
        sequenceCE = "" + sequenceCE + CMnotes[sNote] + " "
        sequenceCE = "" + sequenceCE + CMnotes[sNote] + " "
        sequenceFE = "" + sequenceFE + FMnotes[sNote] + " "
        sequenceFE = "" + sequenceFE + FMnotes[sNote] + " "
    }
    // ostinato
    if (song == 9) {
        numChords = 2
        seqLen = 15
        for (let index = 0; index < 14; index++) {
            sNote = randint(0, Oscale.length)
            ost = "" + ost + Oscale[sNote] + ":4 "
        }
    }
    // Walkdown-bass
    if (song == (CUTTOFF+2)) {
        seqLen = 7
        for (let index = 0; index < 6; index++) {
            sNote = randint(0, Oscale.length)
            ost = "" + ost + Oscale[sNote] + ":4 "
        }
    }
    showBG()
    started = true
}
// do actions for each note
music.onEvent(MusicEvent.MelodyNotePlayed, function () {

    // trigger drums via pins
    if (noteCounter % 2 == 0) { // every other beat
        pins.digitalWritePin(DigitalPin.P2, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P2, 0)
    }

    if (noteCounter % 4 == 0) {// every 4th beat
        pins.digitalWritePin(DigitalPin.P1, 1)
    }
    if (noteCounter % 4 == 2) { // stop it after 2 beats
        pins.digitalWritePin(DigitalPin.P1, 0)
    }


    // reset bright dots
    led.plotBrightness(noteCounter % 5, noteCounter / 5, dim)
    if (song!=18) {
        led.plotBrightness(chordCounter, 4, dim)
    }
    noteCounter += 1
    if (noteCounter >= seqLen) {    
        noteCounter = 0
        if (song != 18)  {  // special random chord
            chordCounter += 1
        }
        // full volume for first note in seq
        music.setVolume(volH)
    } else {
        if (song == 7) {
            // lower volume for non-first note in seq
            music.setVolume(volM)
        }
    }
    if (song == 8) {
        // echo notes
        music.setTempo(600)
        if (noteCounter % 2 == 1) {
            // volume for echo
            music.setVolume(volM)
        } else {
            // volume for note
            music.setVolume(volH)
        }
    }
    if (chordCounter >= numChords) {
        chordCounter = 0
    }

    // light new dots
    led.plotBrightness(noteCounter % 5, noteCounter / 5, 255)
    if (song!=18) {
        led.plotBrightness(chordCounter, 4, 255)
    }




})
let CUTTOFF=20;
let seqShouldTake = 0;
let chordCounter = 0
let noteCounter = 0
let sNote = 0
let ost = ""
let sequenceCs = ""
let sequenceCs2 = ""
let sequenceDm = ""
let sequenceEm = ""
let sequenceGX = ""
let sequenceGE = ""
let sequenceG = ""
let sequenceFE = ""
let sequenceF = ""
let sequenceAmE = ""
let sequenceAmX = ""
let sequenceAm = ""
let sequenceCE = ""
let sequenceC = ""
let seqLen = 0
let started = false
let dim = 0
let DmNotes: string[] = []
let EmNotes: string[] = []
let GXnotes: string[] = []
let GMnotes: string[] = []
let FMnotes: string[] = []
let CMnotes: string[] = []
let AmXNotes: string[] = []
let AmNotes: string[] = []
let Oscale: string[] = []
let Cscale: string[] = []
let numChords = 0
let volM = 0
let volH = 0
let song = 0
let songChars: string[] = []
volH = 255
volM = volH / 2
let volL = 40
music.setTempo(60 * 8)
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
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-"
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
    "a",// Am progression
    "C",// CAFG
    "S",// super-random
    "R", // single 16 random seq
    "1", // 1 4 5
    "L",// long first note
    "V", // volume change
    "E", // echo
    "O",// ostinato
    "_", //10
    "_", //11
    "_", //12
    "_", //13
    "_", //14
    "_", //15
    "_", //16
    "_", //17
    "D", // double - 2 seqs
    "+",// asc chords
    "-",// descenting chords
    "I",// individual patterm for each chord
    "W",// wlkdown
    "r",// single short random seq
    "F" // endless
]
basic.showString(songChars[song], 40)
basic.forever(function () {
    if (started) {  // user has pressed start Button



        // handle each song
        // they vary in # notes, # chords, randomness, volume-change, rests
        // ------------------  16-note songs
        if (song == 1) {
            // Am F G Am
            while (true) {
                music.playMelody(sequenceAm, music.tempo())
                music.playMelody(sequenceF, music.tempo())
                music.playMelody(sequenceG, music.tempo())
                music.playMelody(sequenceAm, music.tempo())
            }
        }
        if (song == 2) {
            // C Am F G
            while (true) {
                music.playMelody(sequenceC, music.tempo())
                music.playMelody(sequenceAm, music.tempo())
                music.playMelody(sequenceF, music.tempo())
                music.playMelody(sequenceG, music.tempo())
            }
        }

        console.log("song=" + song)

        if ((song == 4)  // random 16-note sequence in C scale (has rests)
            || (song == 3) || (song==18) // "super-random" sequence
        ) {
            let start = control.millis();
            let elapsedShouldBe = seqShouldTake
            while (true) {
                if (song == 18) {  // double: 2 random seqs     
                  if (Math.randomBoolean()) {
                        chordCounter = 0
                        led.plotBrightness(0, 4, 255)   
                        led.plotBrightness(1, 4, dim)                       
                        music.playMelody(sequenceCs, music.tempo())
                    } else {
                        chordCounter = 1
                        led.plotBrightness(0, 4, dim)   
                        led.plotBrightness(1, 4, 255)                       
                        music.playMelody(sequenceCs2, music.tempo())
                    }
                }else {
                    music.playMelody(sequenceCs, music.tempo())
                }
                // keep the BPM correct by delaying to target BPM
                let actualElapsed = control.millis() - start
                console.log("elapsed:" + actualElapsed + ", should be:" + elapsedShouldBe)
                basic.pause(elapsedShouldBe - actualElapsed);
                console.log("i just paused:" + (elapsedShouldBe - actualElapsed))
                elapsedShouldBe += seqShouldTake
            }
        }

        console.log("after song=" + song)
        if (song == 5) {
            // C F G F
            while (true) {
                music.playMelody(sequenceC, music.tempo())
                music.playMelody(sequenceF, music.tempo())
                music.playMelody(sequenceG, music.tempo())
                music.playMelody(sequenceF, music.tempo())
            }
        }
        if (song == 6) {
            // 3 note seqs; double-length first note each time
            while (true) {
                music.playMelody("C2:8 E2:4  C2", music.tempo())
                music.playMelody("F2:8 A2:4  F2", music.tempo())
                music.playMelody("G2:8 B2:4  G2", music.tempo())
                music.playMelody("F2:8 C3:4  F2", music.tempo())
            }
        }
        if (song == 7) {
            // 4 note seqs; volume-increase on 1st of every 4
            while (true) {
                music.playMelody("C2 E2 G2 C2", music.tempo())
                music.playMelody("F2 A2 C3 F2", music.tempo())
                music.playMelody("G2 B2 D2 G2", music.tempo())
                music.playMelody("F2 C3 A2 F2", music.tempo())
            }
        }
        if (song == 8) {
            // echoed notes
            while (true) {
                music.playMelody(sequenceCE, music.tempo())
                music.playMelody(sequenceGE, music.tempo())
                music.playMelody(sequenceFE, music.tempo())
                music.playMelody(sequenceGE, music.tempo())
            }
        }
        if (song == 9) {
            // ostinato
            while (true) {
                music.playMelody("C2:8 " + ost, music.tempo())
                music.playMelody("F2:8 " + ost, music.tempo())
            }
        }


        if (song == (CUTTOFF -1)) {
            // Am C Dm F (Ascending Am chords)
            while (true) {
                music.playMelody(sequenceAm, music.tempo())
                music.playMelody(sequenceC, music.tempo())
                music.playMelody(sequenceDm, music.tempo())
                music.playMelody(sequenceF, music.tempo())
            }
        }
        // ------------------ 8-note songs
        if (song == CUTTOFF) {
            // Am G F Em (falling Am)
            while (true) {
                music.playMelody(sequenceAm, music.tempo())
                music.playMelody(sequenceG, music.tempo())
                music.playMelody(sequenceF, music.tempo())
                music.playMelody(sequenceEm, music.tempo())
            }
        }

        if (song == (CUTTOFF+1)) {
            // different pattern for each chord
            // C F G F
            while (true) {
                music.playMelody(sequenceC, music.tempo())
                music.playMelody(sequenceF, music.tempo())
                music.playMelody(sequenceG, music.tempo())
                music.playMelody(sequenceF, music.tempo())
            }
        }

        if (song == (CUTTOFF + 2)) {
            // Walkdown
            while (true) {
                music.playMelody("C3:8 " + ost, music.tempo())
                music.playMelody("B2:8 " + ost, music.tempo())
                music.playMelody("A2:8 " + ost, music.tempo())
                music.playMelody("G2:8 " + ost, music.tempo())
            }
        }

        if (song == (CUTTOFF + 3)) {
            // random 8-note sequence
            while (true) {
                music.playMelody(sequenceCs, music.tempo())
            }
        }


        if (song == (CUTTOFF + 4)) {
            // endless
            while (true) {
                music.playMelody(
                    Cscale[randint(0, Cscale.length - 1)],
                    music.tempo())
            }
        }




    }
})
