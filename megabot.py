import psycopg2

from mega import Mega

from mega.utils import a32_to_str, str_to_a32, a32_to_base64, base64_to_a32,\
    mpi2int, base64urlencode, base64urldecode, get_chunks

from mega.crypto import prepare_key, stringhash, encrypt_key, decrypt_key,\
    enc_attr, dec_attr, aes_cbc_encrypt_a32

m = Mega.from_ephemeral()
conn = psycopg2.connect("dbname=ogatest user=postgres password=1234")

def getfileinfo(file_id, file_key):
  key = base64_to_a32(file_key)
  k = (key[0] ^ key[4], key[1] ^ key[5], key[2] ^ key[6], key[3] ^ key[7])
  iv = key[4:6] + (0, 0)
  meta_mac = key[6:8]

  try:
    file = m.api_req({'a': 'g', 'g': 1, 'p': file_id})
    
    dl_url = file['g']
    size = file['s']
    attributes = base64urldecode(file['at']) 
    attributes = dec_attr(attributes, k)
   
    print "ALIVE: %s (size: %d)" % (attributes['n'], size)

    return [attributes['n'], size, True]

  except:
    print "DEAD: %s now marked as dead" % (file_id)
    return ["", "", False]

def getlinks():
  cur = conn.cursor()
  links = []

  cur.execute("SELECT * FROM links;")

  for record in cur:
    fid = record[0]
    id = record[1][21:29]
    key = record[1][30:]
    print "Fid: %d has id: %s and key: %s" % ( fid, id, key )
    links.append([fid,id,key])

  cur.close()
  return links

def updatelinks(links):
  cur = conn.cursor()

  for link in links:
    fileinfo = getfileinfo(link[1],link[2])
    cur.execute("UPDATE links SET (filename, filesize, alive) = (%s, %s, %s) WHERE fid = %s;", (fileinfo[0], fileinfo[1], fileinfo[2], link[0]))
    print "Updated %d" % (link[0])

  cur.close()

updatelinks(getlinks())

conn.close()