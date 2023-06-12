from microbit import *


# user can change tempo with buttons

def on_button_pressed_a():
    music.change_tempo_by(-20)
    showTempo()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    music.change_tempo_by(20)
    showTempo()
input.on_button_pressed(Button.B, on_button_pressed_b)

def showTempo():
    basic.clear_screen()
    basic.show_number(music.tempo(), 40)
    for index in range(seqLen):
        led.plot_brightness(index % 5, index / 5, dim)

def on_melody_note_played():
    global noteCounter
    led.plot_brightness(noteCounter % 5, noteCounter / 5, dim)
    noteCounter += 1
    if noteCounter >= (seqLen):
        noteCounter = 0
    led.plot_brightness(noteCounter % 5, noteCounter / 5, 255)
    if (noteCounter % 4) == 0:
        pins.digital_write_pin(DigitalPin.P1, 1)
    else:
        pins.digital_write_pin(DigitalPin.P1, 0)
    if (noteCounter % 2) == 0:
        pins.digital_write_pin(DigitalPin.P2, 1)
    else:
        pins.digital_write_pin(DigitalPin.P2, 0)
music.on_event(MusicEvent.MELODY_NOTE_PLAYED, on_melody_note_played)

noteCounter = 0
sNote = 0
music.set_tempo(400)
sequenceC = " "
sequenceAm = " "
sequenceF = " "
sequenceG = " "
CNotes = ["C1",
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
    "B3"]
AmNotes = ["A1", "C2", "E2", "A2", "C3", "E3", "A3", "-", "-", "-", "-"]
CMnotes = ["C1",
    "E1",
    "G1",
    "C2",
    "E2",
    "G2",
    "C3",
    "E3",
    "G3",
    "-",
    "-",
    "-",
    "-"]
FMnotes = ["F1",
    "A1",
    "C2",
    "F2",
    "A2",
    "C3",
    "F3",
    "A3",
    "-",
    "-",
    "-",
    "-"]
GMnotes = ["G1",
    "B1",
    "D2",
    "G2",
    "B2",
    "D3",
    "G3",
    "B3",
    "-",
    "-",
    "-",
    "-"]
dim = 255 / 20
seqLen = 16
for index2 in range(seqLen):
    sNote = randint(0, len(AmNotes) - 1)
    sequenceC = "" + sequenceC + CMnotes[sNote] + " "
    sequenceAm = "" + sequenceAm + AmNotes[sNote] + " "
    sequenceF = "" + sequenceF + FMnotes[sNote] + " "
    sequenceG = "" + sequenceG + GMnotes[sNote] + " "
    led.plot_brightness(index2 % 5, index2 / 5, dim)

def on_forever():
    # music.playMelody(sequenceC, music.tempo())
    music.play_melody(sequenceAm, music.tempo())
    music.play_melody(sequenceF, music.tempo())
    music.play_melody(sequenceG, music.tempo())
    music.play_melody(sequenceAm, music.tempo())
basic.forever(on_forever)
