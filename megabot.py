from mega import Mega

from mega.utils import a32_to_str, str_to_a32, a32_to_base64, base64_to_a32,\
    mpi2int, base64urlencode, base64urldecode, get_chunks

from mega.crypto import prepare_key, stringhash, encrypt_key, decrypt_key,\
    enc_attr, dec_attr, aes_cbc_encrypt_a32

m = Mega.from_ephemeral()

def getfile(file_id, file_key):
  key = base64_to_a32(file_key)
  k = (key[0] ^ key[4], key[1] ^ key[5], key[2] ^ key[6], key[3] ^ key[7])
  iv = key[4:6] + (0, 0)
  meta_mac = key[6:8]

  file = m.api_req({'a': 'g', 'g': 1, 'p': file_id})
  dl_url = file['g']
  size = file['s']
  attributes = base64urldecode(file['at']) 
  attributes = dec_attr(attributes, k)
 
  print "%s (size: %d), url = %s" % (attributes['n'], size, dl_url)

getfile('OBwkVJSZ', 'MAvDylxn087ge0bAO4zntwyNXOxBtQbztEwaDCzHLhU')