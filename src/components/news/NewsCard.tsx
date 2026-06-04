// src/components/news/NewsCard.tsx
import React, { useState } from 'react';
import { ExternalLink, Clock, Globe } from 'lucide-react';
import type { NewsArticle } from '../../lib/rssService';
import { formatRelativeDate, countryFlag } from '../../lib/rssService';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'featured';
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
  const [imgError, setImgError] = useState(false);

  const flag = countryFlag(article.countryCode);

  if (variant === 'compact') {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
      >
        {article.imageUrl && !imgError ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-md flex-shrink-0 flex items-center justify-center text-2xl">
            ⚽
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-500 transition-colors">
            {article.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {flag} {article.sourceName}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-xs text-gray-400">{formatRelativeDate(article.pubDate)}</span>
          </div>
        </div>
      </a>
    );
  }

  if (variant === 'featured') {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block rounded-xl overflow-hidden group h-72"
      >
        {article.imageUrl && !imgError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-blue-900 flex items-center justify-center text-6xl">
            ⚽
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {flag} {article.sourceName}
            </span>
            <span className="text-gray-300 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeDate(article.pubDate)}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg line-clamp-3 group-hover:text-emerald-300 transition-colors">
            {article.title}
          </h3>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </a>
    );
  }

  // Default card
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow group border border-gray-100 dark:border-gray-700"
    >
      {article.imageUrl && !imgError ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-emerald-700 to-blue-800 flex items-center justify-center text-5xl">
          ⚽
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-3 text-sm leading-snug group-hover:text-emerald-500 transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {article.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Globe className="w-3 h-3" />
            {flag} {article.sourceName}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeDate(article.pubDate)}
          </span>
        </div>
      </div>
    </a>
  );
};