import { products } from "../mock/products";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Název</th>
            <th>Cena</th>
            <th>Marže</th>
            <th>Sklad</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} Kč</td>
              <td>{product.margin} %</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
