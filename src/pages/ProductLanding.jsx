// src/pages/ProductLanding.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";

export default function ProductLanding() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-[1000px] mx-auto p-6">
        <h1 className="text-xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-slate-500">We couldn't find that product. <Link to="/" className="underline">Back to home</Link></p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <div className="text-sm text-slate-500 mt-1">{product.short}</div>
          <p className="mt-3 text-slate-600">{product.description}</p>

          <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
            {product.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-sm text-slate-500">Price</div>
          <div className="text-xl font-bold mt-1">{product.price}</div>
          <div className="mt-4 flex flex-col gap-2">
            <a href={product.portalUrl} className="px-4 py-2 rounded-md border text-sm">Open Portal</a>
            <a href={product.buyUrl} className="px-4 py-2 rounded-md bg-xceed-500 text-white text-sm">Buy / Contact Sales</a>
            <Link to="/docs" className="px-4 py-2 rounded-md border text-sm">Docs</Link>
          </div>
        </div>
      </div>

      {/* optional: Related products */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Related products</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-3">
          {products.filter(p => p.id !== product.id).map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="p-3 border rounded hover:shadow-sm">
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-xs text-slate-400">{p.short}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
