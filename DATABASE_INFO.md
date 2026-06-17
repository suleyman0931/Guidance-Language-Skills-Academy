# 🗄️ Database Connection Information

## PostgreSQL Database on Render

**Database Name**: `guidance-academy-db`  
**Status**: ✅ Active  
**Region**: Oregon (US West)  
**PostgreSQL Version**: 16

---

## Connection Details

### For Render Web Services (Use Internal URL)
```env
DB_CONNECTION=pgsql
DB_HOST=dpg-d8p0f937u1sc73nh8rajp-a
DB_PORT=5432
DB_DATABASE=guidance_academy
DB_USERNAME=guidance_academy_user
DB_PASSWORD=adDOsx4sJMolmeSTENMboI18XzqJkZn
```

### Internal Database URL (for Render services)
```
postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a/guidance_academy
```

### External Database URL (for local development)
```
postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com/guidance_academy
```

---

## PSQL Command (for terminal access)

```bash
PGPASSWORD=adDOsx4sJMolmeSTENMboI18XzqJkZn psql -h dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com -U guidance_academy_user -d guidance_academy
```

Or simplified:
```bash
psql "postgresql://guidance_academy_user:adDOsx4sJMolmeSTENMboI18XzqJkZn@dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com/guidance_academy"
```

---

## GUI Database Clients

### TablePlus
- Connection: PostgreSQL
- URL: Use the External Database URL above

### pgAdmin
- Host: `dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `guidance_academy`
- Username: `guidance_academy_user`
- Password: `adDOsx4sJMolmeSTENMboI18XzqJkZn`
- SSL Mode: Prefer or Require

### DBeaver
- Database: PostgreSQL
- Host: `dpg-d8p0f937u1sc73nh8rajp-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `guidance_academy`
- Username: `guidance_academy_user`
- Password: `adDOsx4sJMolmeSTENMboI18XzqJkZn`

---

## ⚠️ Important Security Notes

1. **Keep credentials secure**: Never commit this file to a public repository
2. **Use Internal URL**: For Render web services, always use the internal hostname (without `.oregon-postgres.render.com`)
3. **External URL**: Only use the external URL when connecting from outside Render (local development, GUI tools)
4. **Free tier limitations**: 
   - 256 MB RAM
   - 1 GB Storage
   - Database will be deleted on **July 7, 2025** unless upgraded to paid plan

---

## Next Steps

1. ✅ Database created and ready
2. ⏭️ Create your web service on Render
3. ⏭️ Add these environment variables to your web service
4. ⏭️ Deploy and run migrations

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

---

**Last Updated**: June 17, 2026  
**Database Dashboard**: https://dashboard.render.com/
