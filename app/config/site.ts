export const company = {
  legalName: '无锡源译信息技术有限公司',
  englishLegalName: 'Wuxi Yelinktrans Information Technology Co., Ltd.',
  brandName: '源译',
  brandNameEnglish: 'YELINKTRANS',
  website: 'https://yelinktrans.com',
  founded: '2025-01-22',
  location: '中国·江苏·无锡',
  locationEnglish: 'Wuxi, Jiangsu, China',
  primaryEmail: 'James@yelinktrans.com',
  secondaryEmail: 'Mike@yelinktrans.com'
} as const

export type SiteLocale = 'zh' | 'en'

export const primaryNavigation = {
  zh: [
    { label: '首页', href: '/' },
    { label: '服务与经验', href: '/services' },
    { label: '协作方式', href: '/approach' },
    { label: '关于我们', href: '/#about' }
  ],
  en: [
    { label: 'Home', href: '/' },
    { label: 'Services & Expertise', href: '/services' },
    { label: 'How We Work', href: '/approach' },
    { label: 'About Us', href: '/#about' }
  ]
} as const

export const footerNavigation = {
  zh: [
    ...primaryNavigation.zh,
    { label: '联系合作', href: '/contact' },
    { label: '隐私政策', href: '/privacy' }
  ],
  en: [
    ...primaryNavigation.en,
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' }
  ]
} as const

export const siteCopy = {
  zh: {
    skipLink: '跳至主要内容',
    homeLabel: '无锡源译首页',
    returnHomeLabel: '返回首页',
    navigationLabel: '主导航',
    contactLabel: '联系我们',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    switchLanguageLabel: '切换至英文',
    switchLanguageText: 'EN',
    footerTagline: '专注中国企业出海所需的多语言内容、数据与AI解决方案。',
    quickNavigation: '快速导航',
    contactHeading: '联系',
    privacyPolicy: '隐私政策',
    emailSeparator: '或',
    claimsLabel: '公司能力与团队经验',
    serviceDetail: '了解服务详情',
    contactSectionLabel: '联系合作',
    commonProblems: '客户常见问题',
    serviceScope: '服务范围',
    relatedExperience: '相关经验',
    serviceBoundary: '服务边界',
    coreTeamExperience: '核心团队历史经验',
    projectScope: '项目范围',
    projectChallenge: '项目问题',
    approachTaken: '处理方法',
    privacyToc: '隐私政策目录',
    updatedLabel: '更新日期',
    effectiveLabel: '生效日期',
    fieldSeparator: '：'
  },
  en: {
    skipLink: 'Skip to main content',
    homeLabel: 'Yelinktrans home',
    returnHomeLabel: 'Return to home',
    navigationLabel: 'Primary navigation',
    contactLabel: 'Contact us',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguageLabel: 'Switch to Simplified Chinese',
    switchLanguageText: '中文',
    footerTagline: 'Multilingual content, data and practical AI solutions for Chinese companies expanding globally.',
    quickNavigation: 'Quick Links',
    contactHeading: 'Contact',
    privacyPolicy: 'Privacy Policy',
    emailSeparator: 'or',
    claimsLabel: 'Company capabilities and core team experience',
    serviceDetail: 'Explore service details',
    contactSectionLabel: 'Work with us',
    commonProblems: 'Common Challenges',
    serviceScope: 'Service Scope',
    relatedExperience: 'Relevant Experience',
    serviceBoundary: 'Service Boundaries',
    coreTeamExperience: 'Core Team Historical Experience',
    projectScope: 'Project Scope',
    projectChallenge: 'Project Challenges',
    approachTaken: 'Approach Taken',
    privacyToc: 'Privacy Policy Contents',
    updatedLabel: 'Last Updated',
    effectiveLabel: 'Effective Date',
    fieldSeparator: ':'
  }
} as const
