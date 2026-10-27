'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { StarDivider } from '@/components/svg/Ornaments';
import { Clock, Calendar, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

export default function ContentPage() {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-cairo">
      {/* Breadcrumb & Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-1.5 mb-2 text-xs text-[#8a6b57]">
          <Link href="/" className="hover:text-[#5c3d2e]">الرئيسية</Link>
          <span>/</span>
          <span className="text-[#5c3d2e] font-semibold">المجلة والمحتوى</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-amiri font-bold text-[#5c3d2e] mb-2">
          مجلة جميلة التراثية
        </h1>
        <p className="text-xs text-[#8a6b57] leading-relaxed">
          دراسات وتأملات في الفخامة الهادئة، أسرار الحرير الخام، وتناغم الخطوط المعمارية الإسلامية مع أزياء المرأة المعاصرة.
        </p>
      </div>

      <StarDivider label="إصدارات الأرشيف الفكري" />

      {/* Articles Listing */}
      <div className="space-y-6">
        {articles.map((article) => {
          const isExpanded = expandedArticleId === article.id;
          return (
            <article
              key={article.id}
              id={article.id}
              className="relative bg-[#fcfaf5] border border-[rgba(92,61,46,0.18)] p-5 sm:p-7 hover:border-[#5c3d2e] transition-all duration-300"
            >
              {/* Photo Banner */}
              <div className="w-full h-48 sm:h-60 overflow-hidden bg-[#f8f2e7] border border-[rgba(92,61,46,0.1)] mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8a6b57] mb-2.5 border-b border-[rgba(92,61,46,0.1)] pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-[#5c3d2e] px-2 py-0.5 border border-[rgba(92,61,46,0.18)] rounded-xs text-[11px]">
                    {article.kicker}
                  </span>
                  <span className="text-[11px]">{article.category}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{article.readTime}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>{article.date}</span>
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-amiri font-bold text-[#3d2a1f] mb-2 leading-snug">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xs text-[#3d2a1f]/85 leading-relaxed mb-4">
                {article.excerpt}
              </p>

              {/* Expanded Full Content */}
              {isExpanded && (
                <div className="pt-3.5 border-t border-[rgba(92,61,46,0.1)] space-y-3 text-xs sm:text-sm text-[#3d2a1f]/90 leading-relaxed animate-fade-in bg-[#f8f2e7]/40 p-4 rounded-xs mb-4">
                  {article.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="font-normal">
                      {paragraph}
                    </p>
                  ))}
                  <div className="pt-1 text-[10px] text-[#8a6b57] italic">
                    — تحرير: قسم التراث والأصالة في دار جميلة للأزياء
                  </div>
                </div>
              )}

              {/* Read / Expand Trigger Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleExpand(article.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5c3d2e] text-[#f8f2e7] text-xs font-semibold hover:bg-[#3d2a1f] transition-colors"
                >
                  <span>{isExpanded ? 'إخفاء المقال' : 'قراءة المقال كاملاً'}</span>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('تم نسخ رابط المقال');
                  }}
                  className="text-xs text-[#8a6b57] hover:text-[#5c3d2e] flex items-center gap-1"
                  title="مشاركة المقال"
                >
                  <Share2 size={12} />
                  <span>مشاركة</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
