# 💸 ¿Qué te debo?

**¿Qué te debo?** es la app para cuando salís con tus amig@s, alguien compra la carne, otro el fernet y después nadie sabe quién le debe a quién. Cada uno anota lo que puso, la app hace la cuenta y te dice quién le pasa cuánto a quién. Sin calculadora en la sobremesa. 🇦🇷

🔗 Probala en: [quetedebo.vercel.app](https://quetedebo.vercel.app)

---

## 🧉 ¿Cómo se usa?

1. **Sentá a tus amigos a la mesa**: nombre, qué trajo (opcional) y cuánto puso.
2. **Mirá la mesa**: el total de la juntada y lo que le toca poner a cada uno.
3. **Fijate quién le pasa a quién**: la cuenta se actualiza en vivo, a medida que cargás gente.
4. **Marcá lo que ya se pagó** y copiá el resumen para el grupo de WhatsApp. La juntada se guarda sola en el historial en cuanto hay pagos para hacer, y se actualiza cada vez que alguien se suma o cambia algo.
5. **¿Querés que cada uno cargue lo suyo?** Tocá *Compartir la mesa con el grupo*: se crea una mesa compartida con un link. Mandalo al grupo y cada uno suma su nombre y su gasto desde su celular. Todos ven la misma mesa, actualizada en vivo, y cualquiera con el link puede cambiar o sacar a cualquiera.

> La cuenta es **pareja entre todos los que están en la mesa**: cada uno pone la misma parte del total. Si alguien no participó de un gasto, todavía no hay forma de excluirlo.

---

## 🚀 Funcionalidades

- 🪑 Mesa redonda con tus amigos alrededor y el total de la juntada en el centro.
- 🧾 Quién puso qué, con una barra para ver de un vistazo quién puso más.
- 💰 Cuenta en vivo: quién le pasa cuánto a quién para dejar todo parejo.
- ✅ Marcar pagos como saldados.
- 📋 Copiar un resumen para pegar en el grupo.
- 🔗 Mesa compartida: un link para el grupo y cada uno suma lo suyo, en vivo.
- ✏️ Cambiar los datos de alguien que ya está en la mesa.
- 📚 Historial automático de juntadas, **en tu navegador**: una entrada por mesa, que se actualiza sola.
- 🇦🇷 Montos al estilo argentino: `28.000`, `1200,50`.

La mesa en curso y el historial se guardan **en el dispositivo**: si cerrás la app o recargás, la mesa sigue ahí. Las mesas compartidas viven en [Supabase](https://supabase.com) y las ve cualquiera que tenga el link.

---

## 🛠️ Tecnologías

- ⚛️ React 19 + React Router
- 🟦 TypeScript
- 🎨 Tailwind CSS 4
- ⚡ Vite
- 🧪 Vitest
- 💾 `localStorage`
- 🟢 Supabase (Postgres + Realtime) para las mesas compartidas

---

## 💻 Correrlo en tu compu

```bash
pnpm install
pnpm dev          # servidor de desarrollo
pnpm test         # tests de la cuenta y los helpers
pnpm build        # typecheck + build de producción
pnpm lint
```

### Mesas compartidas (opcional)

Sin configurar nada, la app anda igual y simplemente no ofrece mesas compartidas. Para activarlas:

1. Creá un proyecto en Supabase y aplicá la migración: `supabase link --project-ref <ref>` y después `supabase db push` (o pegá `supabase/migrations/*.sql` en el SQL Editor).
2. Copiá `.env.example` a `.env.local` y completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API). Cargá las mismas variables en Vercel.

El navegador nunca toca las tablas: todo pasa por funciones de Postgres que piden el id de la mesa (un uuid imposible de adivinar), así que nadie puede listar las mesas de otros. Para que la mesa se actualice en vivo, cada dispositivo avisa a los demás por un canal de *broadcast* de Realtime y todos la vuelven a leer.

La lógica de la cuenta está en `src/utils/calculateSettlements.ts`: trabaja en centavos para no perder plata por decimales flotantes y tiene tests que lo cubren.

```
src/
├── components/   # mesa redonda, avatares, tarjetas de pago, navbar, footer
├── hooks/        # useCalculate: estado de la mesa e historial
├── pages/        # Inicio (la mesa) e Historial
├── types/
└── utils/        # calculateSettlements, format (+ tests)
```

---

## 🔭 Lo que viene

Ideas en las que estamos pensando, sin fecha:

- 💳 Poder cargar tu alias de Mercado Pago para que te paguen más fácil (la plata nunca pasa por la app).
- 📱 Instalarla en el celu como app.

---

## 👨‍💻 Autor

Desarrollado con 💙 por [Matías Carrera](https://www.linkedin.com/in/matias-carrera)

---

## 🧾 Licencia

MIT — Usalo tranquilo, compartilo, mejoralo.

---

> “Las cuentas claras conservan la amistad.” – Algún sabio en una juntada con fernet.
