import React from 'react';
import {Circle} from 'lucide-react';
import {useNavigate} from '@remix-run/react';

interface Product {
  id: number;
  name: string;
  path: string;
  position: {top: string; left: string};
}

const products: Product[] = [
  {
    id: 1,
    name: 'Grey Signature Hoodie',
    path: '/products/grey-signature-hoodie',
    position: {top: '25%', left: '50%'},
  },
  {
    id: 2,
    name: 'Black Baggy Sweatpants',
    path: '/products/black-baggy-sweatpants',
    position: {top: '60%', left: '50%'},
  },
];

export default function ShopTheFit() {
  const navigate = useNavigate();

  return (
    <section className="relative mx-auto">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
        <img
          src="/shop-the-fit.webp"
          alt="Street style outfit"
          className="w-full h-full object-cover"
        />

        {products.map((product) => (
          <button
            key={product.id}
            className="absolute group"
            style={product.position}
            onClick={() => navigate(product.path)}
          >
            <div className="relative">
              <Circle
                className="w-8 h-8 text-white"
                fill="rgb(217, 208, 201)"
                fillOpacity={0.8}
              />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-[rgb(217,208,201)] opacity-75 animate-ping" />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-[rgb(217,208,201)] opacity-50 animate-pulse" />
            </div>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[rgb(217,208,201)] text-black p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {product.name}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
