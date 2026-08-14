"use client";

import { useMemo, useState } from "react";

export type PublicSearchItem = {
  id: string;
  type: string;
  title: string;
  meta: string;
  anchor: string;
};

export function PublicSearch({ items }: { items: PublicSearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("fa-IR");
  const results = useMemo(() => {
    if (!normalized) return [];
    return items
      .filter((item) => `${item.title} ${item.meta} ${item.type}`.toLocaleLowerCase("fa-IR").includes(normalized))
      .slice(0, 8);
  }, [items, normalized]);

  return <div className="public-search">
    <div className="public-search-copy"><span>جست‌وجوی یکپارچه</span><b>خبر، پروژه، حوزه، مناقصه و موضوع استان را یکجا پیدا کنید</b></div>
    <div className="public-search-box">
      <span aria-hidden>⌕</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="مثلاً آب، شاهرود، گردشگری، مناقصه…" aria-label="جست‌وجوی محتوای پرتال" />
      {query ? <button type="button" onClick={() => setQuery("")}>پاک کردن</button> : <small>جست‌وجوی درون داده فعلی</small>}
      {normalized ? <div className="public-search-results">
        {results.length ? results.map((item) => <a href={item.anchor} key={item.id} onClick={() => setQuery("")}><span>{item.type}</span><div><b>{item.title}</b><small>{item.meta}</small></div><i>↙</i></a>) : <p>موردی پیدا نشد؛ عبارت کوتاه‌تر یا نام یک شهرستان را جست‌وجو کنید.</p>}
      </div> : null}
    </div>
  </div>;
}
