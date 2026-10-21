export interface FeatureCategory {
  id: string;
  name: string;
  badge?: string;
  description?: string;
  tags?: string[];
  images: string[];
}

export interface AppTechnicalDetail {
  index: string;
  title: string;
  content: string;
}

export interface AppItem {
  id: string;
  title: string;
  category?: string;
  categoryLabel?: string;
  description: string;
  images: string[];
  features?: string[];
  featureCategories?: FeatureCategory[];
  technicalDetails?: AppTechnicalDetail[];
}

export interface PortfolioSectionProps {
  title: string;
  apps: AppItem[];
  enableFilter?: boolean;
  locale?: string;
}
