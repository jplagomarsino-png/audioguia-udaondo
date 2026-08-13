import json, urllib.request

TOK = 'APP_USR-5275443631355181-052213-ec0aa1f1416757409ff5c5caf446e692-39996519'
B = chr(66) + 'earer ' + TOK

body = json.dumps({
    'items': [{'title': 'Test pase', 'quantity': 1, 'unit_price': 3000, 'currency_id': 'ARS'}]
}).encode()

req = urllib.request.Request(
    'https://api.mercadopago.com/checkout/preferences',
    data=body,
    method='POST',
    headers={'Authorization': B, 'Content-Type': 'application/json'},
)
try:
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
        print('OK HTTP', r.status)
        print('ID:', data.get('id'))
        print('INIT:', data.get('init_point'))
except urllib.error.HTTPError as e:
    print('ERROR HTTP', e.code)
    print(e.read().decode()[:400])
