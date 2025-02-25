import React, { Suspense } from 'react';
import { fetchProducts, fetchCustomers, fetchCategories } from '@/app/lib/data';
import { CreateProduct } from '@/app/ui/products/create-btn-product';
import ProductsTable from '@/app/ui/products/products-table';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ProductsTableSkeleton from '@/app/ui/skeletons';
import { ProductsNav } from '@/app/ui/products/nav';
import Search from '@/app/ui/products/search';
import CategoryFilter from '@/app/ui/products/category-filter';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query?: string;
    category?: string;
    page?: string;
  };
}) {
  const { query = '', category = '', page = '1' } = searchParams;
  const currentPage = Number(page);

  const [products, customers, categories] = await Promise.all([
    fetchProducts(query, category, currentPage),
    fetchCustomers(),
    fetchCategories(),
  ]);

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
        <CreateProduct />
      </div>

      {/* Navigation and filters */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <ProductsNav categories={categories} />
        <Search placeholder="Search products..." />
      </div>

      {/* Categories */}
      <div className="mt-4 flex gap-2">
        <CategoryFilter categories={categories} />
      </div>

      {/* Products Table with Suspense */}
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable 
          products={products} 
          customers={customers}
        />
      </Suspense>
    </div>
  );
}
