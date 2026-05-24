# Hopeless Express Admin Dashboard

Static admin dashboard UI for managing package shipments. This project uses plain HTML, CSS, and JavaScript.

## Pages

- `login/` - Login page.
- `index.html` - Dashboard page.
- `pengiriman/` - Shipment list.
- `tambah/` - Add shipment form.
- `penerima/` - Recipient list.
- `resi/` - Tracking number list.
- `lokasi/` - Location management.
- `user/` - User management.
- `laporan/` - Reports.
- `pengaturan/` - Settings.

## Demo Login

Use the prefilled demo account:

- Email: `admin@hopeless.local`
- Password: `admin123`

Login is stored in `sessionStorage`. If the user is not logged in, dashboard pages redirect to `login/`.

## Run

Open the project with a static web server, then visit:

```text
/dashboard-pengiriman-admin/login/
```

Example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/dashboard-pengiriman-admin/login/
```

## Notes

This is a front-end demo only. There is no backend, database, or real authentication yet.
