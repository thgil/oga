import psycopg2
import Queue
import threading
from mega import Mega
from mega.utils import a32_to_str, str_to_a32, a32_to_base64, base64_to_a32,\
    mpi2int, base64urlencode, base64urldecode, get_chunks
from mega.crypto import prepare_key, stringhash, encrypt_key, decrypt_key,\
    enc_attr, dec_attr, aes_cbc_encrypt_a32

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
    print "DEAD: %s" % (file_id)
    return ["", "", False]

def transferlinks():
  cur = conn.cursor()
  cur.execute("INSERT INTO links(link) SELECT * FROM tmplinks;")
  cur.close()
  conn.commit()

def getlinks():
  cur = conn.cursor()
  links = []

  cur.execute("SELECT fid,link FROM links;")

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

  #use a map here?
  for link in links:
    try:
      fileinfo = getfileinfo(link[1],link[2])
      cur.execute("UPDATE links SET (filename, filesize, alive) = (%s, %s, %s) WHERE fid = %s;", (fileinfo[0], fileinfo[1], fileinfo[2], link[0]))
      cur.execute("SELECT fid FROM links WHERE name = NULL;")
      for fid in cur:
        try:
          cur.execute("UPDATE links SET (name, ip) = (%s, %s) WHERE fid = %s;", (fileinfo[0], '127.0.0.1', fid[0]))
        except psycopg2.IntegrityError, e:
          conn.rollback()
    except psycopg2.IntegrityError, e:
      conn.rollback()

  print "%d updated!" % len(links)

  cur.close()

def cleanlinks():
  cur = conn.cursor()

  cur.execute("DELETE FROM links where alive=false;")
  cur.execute("DELETE FROM tmplinks;")

  cur.close()

m = Mega.from_ephemeral()
conn = psycopg2.connect("dbname=ogatest user=postgres password=1234")

def main():
  transferlinks()
  updatelinks(getlinks())
  cleanlinks()

  conn.commit()
  conn.close()

if __name__ == "__main__":
  main()