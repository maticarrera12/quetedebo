import { useState } from "react";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { red } from "@mui/material/colors";
import "../styles/CalculateComponent.css";

const CalculateComponent = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [gasto, setGasto] = useState("");
  const totalGasto = amigos.reduce(
    (total, amigo) => total + Number(amigo.expense),
    0
  );

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const addFriend = () => {
    if (nombre.trim() === "" || gasto.trim() === "") {
      return;
    }
    const formattedName = capitalizeFirstLetter(nombre); // Aplica la transformación
    const newFriend = { name: formattedName, expense: gasto };
    setAmigos([...amigos, newFriend]);
    setNombre("");
    setGasto("");
  };

  const resetButton = () => {
    setAmigos([]);
    setNombre("");
    setGasto("");
    setTransacciones([]);
  };

  const handleCalcular = () => {
    const totalGasto = amigos.reduce(
      (total, amigo) => total + Number(amigo.expense),
      0
    );
    const gastoPromedio = totalGasto / amigos.length;

    const diferencias = amigos.map((amigo) => ({
      name: amigo.name,
      diferencia: Number(amigo.expense) - gastoPromedio,
    }));

    const deudores = diferencias.filter((d) => d.diferencia < 0);
    const acreedores = diferencias.filter((d) => d.diferencia > 0);

    const transaccionesCalculadas = [];

    deudores.forEach((deudor) => {
      let deuda = Math.abs(deudor.diferencia);
      acreedores.forEach((acreedor) => {
        if (deuda > 0) {
          const pago = Math.min(deuda, acreedor.diferencia);
          transaccionesCalculadas.push(
            `${deudor.name} debe $${pago.toFixed(2)} a ${acreedor.name}`
          );
          deuda -= pago;
          acreedor.diferencia -= pago;
        }
      });
    });
    setTransacciones(transaccionesCalculadas);
  };

  const deleteFriend = (index) => {
    const updatedAmigos = amigos.filter((_, i) => i !== index);
    setAmigos(updatedAmigos);
  };

  return (
    <div className="calculator-container">
      <h2>Paguen sus deudas o sufran las consecuencias</h2>
      <form className="calculator-form">
        <div className="input-div">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre"
            onKeyDown={(e) => {
              if (!/^[A-Za-z ]/.test(e.key) && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
          />
          <input
            type="number"
            value={gasto}
            onChange={(e) => setGasto(e.target.value)}
            placeholder="Gasto"
          />
        </div>
        <div className="button-container">
          <div className="top-buttons">
            <button className="add-button" onClick={addFriend} type="button">
              Agregar
            </button>
            <button
              className="delete-button"
              onClick={resetButton}
              type="button"
            >
              Borrar
            </button>
          </div>
          <button
            onClick={() => handleCalcular()}
            type="button"
            className="full-width calculate-button"
          >
            Calcular
          </button>
        </div>
        <div className="results-container">
          <ul className="list-friends">
            {amigos.map((amigo, index) => (
              <li key={index}>
                {amigo.name} puso: ${amigo.expense}
                <DeleteForeverRoundedIcon
                  onClick={() => deleteFriend(index)}
                  sx={{ color: red[500] }}
                />
              </li>
            ))}
          </ul>
          <p>
            <b>Total: ${totalGasto}</b>
          </p>
          <ul className="transaction-list">
            {transacciones.map((transaccion, index) => (
              <li key={index}>{transaccion}</li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default CalculateComponent;
