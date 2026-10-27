'use client';

import React from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { StarDivider } from '@/components/svg/Ornaments';
import { ArrowLeft, Clock } from 'lucide-react';

export const MagazineSection: React.FC = () => {
  const featuredArticles = articles.slice(0, 3);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[rgba(92,61,46,0.12)]">
      <StarDivider label="المجلة والمحتوى التراثي" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-amiri font-bold text-[#5c3d2e] mb-1">
            من وحي الحياكة والتراث
          </h2>
          <p className="text-xs sm:text-sm text-[#8a6b57] font-cairo">
            مقالات ودراسات حول فنون العمارة الإسلامية، أسرار الحرير الطبيعي، وأصالة الأزياء العربية.
          </p>
        </div>

        <Link
          href="/content"
          className="inline-flex items-center gap-1.5 text-xs font-cairo font-semibold text-[#5c3d2e] hover:text-[#3d2a1f] border-b border-[#5c3d2e] pb-0.5"
        >
          <span>تصفح جميع المقالات</span>
          <ArrowLeft size={14} />
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {featuredArticles.map((article) => (
          <article
            key={article.id}
            className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 sm:p-6 flex flex-col justify-between hover:border-[#5c3d2e] hover:shadow-[0_10px_25px_rgba(92,61,46,0.06)] transition-all duration-300 group"
          >
            <div>
              {/* Photo Thumbnail */}
              <div className="w-full h-44 sm:h-48 overflow-hidden bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] mb-3">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Kicker & Meta */}
              <div className="flex items-center justify-between text-[11px] font-cairo text-[#8a6b57] mb-2 border-b border-[rgba(92,61,46,0.1)] pb-1.5">
                <span className="font-semibold text-[#5c3d2e]">{article.kicker}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-amiri font-bold text-[#3d2a1f] mb-2 leading-snug group-hover:text-[#5c3d2e] transition-colors">
                <Link href={`/content#${article.id}`}>
                  {article.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-[11px] sm:text-xs text-[#3d2a1f]/80 font-cairo leading-relaxed mb-4 line-clamp-2">
                {article.excerpt}
              </p>
            </div>

            {/* Read Article Link */}
            <div className="pt-2.5 border-t border-[rgba(92,61,46,0.1)] flex items-center justify-between">
              <span className="text-[10px] text-[#8a6b57] font-cairo">{article.date}</span>
              <Link
                href={`/content#${article.id}`}
                className="text-xs font-cairo font-semibold text-[#5c3d2e] flex items-center gap-1 hover:text-[#3d2a1f]"
              >
                <span>قراءة المقال</span>
                <ArrowLeft size={13} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
