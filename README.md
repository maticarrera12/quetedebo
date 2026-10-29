# 💸 ¿Qué te debo?

**¿Qué te debo?** es la app para cuando salís con tus amig@s, alguien compra la carne, otro el fernet y después nadie sabe quién le debe a quién. Cada uno anota lo que puso, la app hace la cuenta y te dice quién le pasa cuánto a quién. Sin calculadora en la sobremesa. 🇦🇷

🔗 Probala en: [quetedebo.vercel.app](https://quetedebo.vercel.app)

---

## 🧉 ¿Cómo se usa?

1. **Sentá a tus amigos a la mesa**: nombre, qué trajo (opcional) y cuánto puso.
2. **Mirá la mesa**: el total de la juntada y lo que le toca poner a cada uno.
3. **Fijate quién le pasa a quién**: la cuenta se actualiza en vivo, a medida que cargás gente.
4. **Marcá lo que ya se pagó**, copiá el resumen para el grupo de WhatsApp y guardá la juntada en el historial.

> La cuenta es **pareja entre todos los que están en la mesa**: cada uno pone la misma parte del total. Si alguien no participó de un gasto, todavía no hay forma de excluirlo.

---

## 🚀 Funcionalidades

- 🪑 Mesa redonda con tus amigos alrededor y el total de la juntada en el centro.
- 🧾 Quién puso qué, con una barra para ver de un vistazo quién puso más.
- 💰 Cuenta en vivo: quién le pasa cuánto a quién para dejar todo parejo.
- ✅ Marcar pagos como saldados.
- 📋 Copiar un resumen para pegar en el grupo.
- 📚 Historial de juntadas guardadas, **en tu navegador** (no hay cuentas ni servidor).
- 🇦🇷 Montos al estilo argentino: `28.000`, `1200,50`.

Por ahora el historial vive en el dispositivo donde lo guardás: no se comparte entre celulares.

---

## 🛠️ Tecnologías

- ⚛️ React 19 + React Router
- 🟦 TypeScript
- 🎨 Tailwind CSS 4
- ⚡ Vite
- 🧪 Vitest
- 💾 `localStorage`

---

## 💻 Correrlo en tu compu

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # tests de la cuenta y los helpers
npm run build    # typecheck + build de producción
npm run lint
```

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
- 🔗 Compartir la mesa con un link para que todos la vean.

---

## 👨‍💻 Autor

Desarrollado con 💙 por [Matías Carrera](https://www.linkedin.com/in/matias-carrera)

---

## 🧾 Licencia

MIT — Usalo tranquilo, compartilo, mejoralo.

---

> “Las cuentas claras conservan la amistad.” – Algún sabio en una juntada con fernet.
