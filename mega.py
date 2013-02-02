from Crypto.Cipher import AES
from Crypto.PublicKey import RSA
from Crypto.Util import Counter
 
import base64
import binascii
import json
import os
import random
import struct
import sys
import urllib
 
seqno = random.randint(0, 0xFFFFFFFF)
 
def api_req(req):
  global seqno
  url = 'https://g.api.mega.co.nz/cs?id=%d%s' % (seqno, '&amp;sid=%s' % sid if sid else '')
  seqno += 1
  return json.loads(post(url, json.dumps([req])))[0]
 
def post(url, data):
  return urllib.urlopen(url, data).read()

def base64_to_a32(s):
  return str_to_a32(base64urldecode(s))

def getfile(file_id, file_key):
  key = base64_to_a32(file_key)
  k = (key[0] ^ key[4], key[1] ^ key[5], key[2] ^ key[6], key[3] ^ key[7])
  iv = key[4:6] + (0, 0)
  meta_mac = key[6:8]

  file = api_req({'a': 'g', 'g': 1, 'p': file_id})
  dl_url = file['g']
  size = file['s']
  attributes = base64urldecode(file['at']) 
  attributes = dec_attr(attributes, k)

  print('Downloading {0} (size: {1}), url = {2}.'.format(attributes['n'], size, dl_url))