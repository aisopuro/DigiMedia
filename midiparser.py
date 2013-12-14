# this file listens to a midi channel and parses it into (almost) JSON

import pygame
import pygame.locals as pgl
import pygame.midi
import time

channel_in = 1
going = True

pygame.init()
pygame.fastevent.init()
event_get = pygame.fastevent.get
event_post = pygame.fastevent.post
 
pygame.midi.init()

for i in range(0,4):
	print i, pygame.midi.get_device_info(i);

i = pygame.midi.Input(channel_in)
window = pygame.display.set_mode((468, 60))
timer_i = 0
fmfile = open('out.json', 'w')

print "Waiting..."

# Add file printing

def print_out(str,out = ""):
	global fmfile
	if (out != ""):
		print out
	fmfile.write(str);

# add js formatting

def js_timer_reset():
	global timer_i
	timer_i = time.time()
	return timer_i
	
def js_get_timer():
	global timer_i
	now = time.time()
	return (now-timer_i)


def js_out_start():
	jsheader = "{\n"
	print_out(jsheader,"Track start")
	print_out("\t{\"timestamp\":0.0,\"event\":\"musicstart\"},")

def js_out_end():
	jsfooter = "\t{{\"timestamp\":{:.3},\"event\":\"musicend\"}}\n}}".format(js_get_timer())
	print_out(jsfooter,"Track end")
	fmfile.close()
	pygame.midi.quit()
	exit()
	
def js_out_event(event, note, data):
	times = 0;
	ss = "\t{{\"timestamp\":{:.3},\"event\":\"{}\",\"note\":{},\"data\":\"{}\"}},\n".format(js_get_timer(),event, note, data)
	print_out(ss,"note")

# end of js formatting
	
def note_down(note):
	if (note == 59): # B4
		js_timer_reset()
		js_out_start()
	elif (note >= 60):
		js_out_event("musicevent", note-60, "start")

def note_up(note):
	if (note == 57): # A4
		js_out_end()
		going = False
	elif (note >= 60):
		js_out_event("musicevent", note-60, "end")

def process_midi_in(e, mt):
	if e.status == 144:
		note_down(e.data1);
	if e.status == 128:
		note_up(e.data1);

while going:
    events = event_get()
    for e in events:
        if e.type in [pgl.QUIT]:
            going = False
        if e.type in [pgl.KEYDOWN]:
            going = False
        if e.type in [pygame.midi.MIDIIN]:
            process_midi_in(e, mt);
 
    if i.poll():
        midi_events = i.read(10)
        mt = pygame.midi.time()
        # convert them into pygame events.
        midi_evs = pygame.midi.midis2events(midi_events, i.device_id)
 
        for m_e in midi_evs:
            event_post( m_e )

fmfile.close()			
del i
pygame.midi.quit()