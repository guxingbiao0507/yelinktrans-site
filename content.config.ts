import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const linkSchema = z.object({
  label: z.string(),
  href: z.string()
})

const seoSchema = z.object({
  title: z.string(),
  description: z.string()
})

const pageHeroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  titleLines: z.array(z.string()).optional(),
  description: z.string(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional()
})

const itemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string()
})

const homeEnSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    highlight: z.string(),
    description: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    note: z.string()
  }),
  claims: z.array(z.object({
    value: z.string(),
    label: z.string(),
    qualifier: z.string()
  })),
  services: z.object({
    eyebrow: z.string(),
    title: z.string(),
    mobileTitle: z.string().optional(),
    description: z.string(),
    items: z.array(itemSchema)
  }),
  industries: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    descriptionNoWrapText: z.string().optional(),
    descriptionSingleLine: z.boolean().optional(),
    items: z.array(itemSchema)
  }),
  approach: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    calloutItems: z.array(z.string()),
    steps: z.array(z.object({
      number: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  trust: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(itemSchema)
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primaryCta: linkSchema
  })
})

const servicesEnSchema = z.object({
  seo: seoSchema,
  hero: pageHeroSchema,
  overview: z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleLines: z.array(z.string()).optional(),
    description: z.string(),
    descriptionLines: z.array(z.string()).optional(),
    descriptionNoWrapText: z.string().optional()
  }),
  services: z.array(z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    summary: z.string(),
    challenge: z.string(),
    scope: z.array(z.string()),
    evidence: z.string(),
    boundary: z.string()
  })),
  industries: z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleLines: z.array(z.string()).optional(),
    description: z.string(),
    descriptionNoWrapText: z.string().optional(),
    items: z.array(itemSchema)
  }),
  cases: z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleLines: z.array(z.string()).optional(),
    items: z.array(z.object({
      id: z.string(),
      industry: z.string(),
      title: z.string(),
      profile: z.string(),
      scale: z.string(),
      services: z.array(z.string()),
      challenge: z.array(z.string()),
      approach: z.array(z.string())
    }))
  }),
  cta: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primary: linkSchema,
    secondary: linkSchema
  })
})

const approachEnSchema = z.object({
  seo: seoSchema,
  hero: pageHeroSchema,
  intro: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()),
    callout: z.string()
  }),
  steps: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      number: z.string(),
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      outputs: z.array(z.string())
    }))
  }),
  scenarios: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      titleLines: z.array(z.string()).optional(),
      description: z.string()
    }))
  }),
  collaboration: z.object({
    eyebrow: z.string(),
    title: z.string(),
    titleLines: z.array(z.string()).optional(),
    description: z.string(),
    descriptionLines: z.array(z.string()).optional(),
    descriptionNoWrapText: z.string().optional(),
    clientTitle: z.string(),
    clientItems: z.array(z.string()),
    yelinkTitle: z.string(),
    yelinkItems: z.array(z.string())
  }),
  cta: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primary: linkSchema,
    secondary: linkSchema
  })
})

const contactEnSchema = z.object({
  seo: seoSchema,
  hero: pageHeroSchema,
  methods: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      icon: z.string(),
      label: z.string(),
      value: z.string(),
      href: z.string().optional()
    }))
  }),
  brief: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  }),
  safety: z.object({
    title: z.string(),
    paragraphs: z.array(z.string())
  }),
  primaryCta: linkSchema,
  secondaryCta: linkSchema
})

const privacyEnSchema = z.object({
  seo: seoSchema,
  hero: pageHeroSchema,
  updated: z.string(),
  effective: z.string(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()).optional(),
    bullets: z.array(z.string()).optional(),
    subsections: z.array(z.object({
      title: z.string(),
      paragraphs: z.array(z.string()).optional(),
      bullets: z.array(z.string()).optional()
    })).optional()
  }))
})

export default defineContentConfig({
  collections: {
    homeZh: defineCollection({
      type: 'data',
      source: 'zh/home.yml',
      schema: z.object({
        seo: seoSchema,
        hero: z.object({
          eyebrow: z.string(),
          title: z.string(),
          highlight: z.string(),
          description: z.string(),
          primaryCta: linkSchema,
          secondaryCta: linkSchema,
          note: z.string()
        }),
        claims: z.array(z.object({
          value: z.string(),
          label: z.string(),
          qualifier: z.string()
        })),
        services: z.object({
          eyebrow: z.string(),
          title: z.string(),
          mobileTitle: z.string().optional(),
          description: z.string(),
          items: z.array(itemSchema)
        }),
        industries: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          descriptionNoWrapText: z.string().optional(),
          descriptionSingleLine: z.boolean().optional(),
          items: z.array(itemSchema)
        }),
        approach: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          calloutItems: z.array(z.string()),
          steps: z.array(z.object({
            number: z.string(),
            title: z.string(),
            description: z.string()
          }))
        }),
        trust: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(itemSchema)
        }),
        contact: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          primaryCta: linkSchema
        })
      })
    }),
    servicesZh: defineCollection({
      type: 'data',
      source: 'zh/services.yml',
      schema: z.object({
        seo: seoSchema,
        hero: pageHeroSchema,
        overview: z.object({
          eyebrow: z.string(),
          title: z.string(),
          titleLines: z.array(z.string()).optional(),
          description: z.string(),
          descriptionLines: z.array(z.string()).optional(),
          descriptionNoWrapText: z.string().optional()
        }),
        services: z.array(z.object({
          id: z.string(),
          icon: z.string(),
          title: z.string(),
          summary: z.string(),
          challenge: z.string(),
          scope: z.array(z.string()),
          evidence: z.string(),
          boundary: z.string()
        })),
        industries: z.object({
          eyebrow: z.string(),
          title: z.string(),
          titleLines: z.array(z.string()).optional(),
          description: z.string(),
          descriptionNoWrapText: z.string().optional(),
          items: z.array(itemSchema)
        }),
        cases: z.object({
          eyebrow: z.string(),
          title: z.string(),
          titleLines: z.array(z.string()).optional(),
          items: z.array(z.object({
            id: z.string(),
            industry: z.string(),
            title: z.string(),
            profile: z.string(),
            scale: z.string(),
            services: z.array(z.string()),
            challenge: z.array(z.string()),
            approach: z.array(z.string())
          }))
        }),
        cta: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          primary: linkSchema,
          secondary: linkSchema
        })
      })
    }),
    approachZh: defineCollection({
      type: 'data',
      source: 'zh/approach.yml',
      schema: z.object({
        seo: seoSchema,
        hero: pageHeroSchema,
        intro: z.object({
          eyebrow: z.string(),
          title: z.string(),
          paragraphs: z.array(z.string()),
          callout: z.string()
        }),
        steps: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(z.object({
            number: z.string(),
            icon: z.string(),
            title: z.string(),
            description: z.string(),
            outputs: z.array(z.string())
          }))
        }),
        scenarios: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(z.object({
            title: z.string(),
            titleLines: z.array(z.string()).optional(),
            description: z.string()
          }))
        }),
        collaboration: z.object({
          eyebrow: z.string(),
          title: z.string(),
          titleLines: z.array(z.string()).optional(),
          description: z.string(),
          descriptionLines: z.array(z.string()).optional(),
          descriptionNoWrapText: z.string().optional(),
          clientTitle: z.string(),
          clientItems: z.array(z.string()),
          yelinkTitle: z.string(),
          yelinkItems: z.array(z.string())
        }),
        cta: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          primary: linkSchema,
          secondary: linkSchema
        })
      })
    }),
    contactZh: defineCollection({
      type: 'data',
      source: 'zh/contact.yml',
      schema: z.object({
        seo: seoSchema,
        hero: pageHeroSchema,
        methods: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(z.object({
            icon: z.string(),
            label: z.string(),
            value: z.string(),
            href: z.string().optional()
          }))
        }),
        brief: z.object({
          eyebrow: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(z.object({
            title: z.string(),
            description: z.string()
          }))
        }),
        safety: z.object({
          title: z.string(),
          paragraphs: z.array(z.string())
        }),
        primaryCta: linkSchema,
        secondaryCta: linkSchema
      })
    }),
    privacyZh: defineCollection({
      type: 'data',
      source: 'zh/privacy.yml',
      schema: z.object({
        seo: seoSchema,
        hero: pageHeroSchema,
        updated: z.string(),
        effective: z.string(),
        sections: z.array(z.object({
          id: z.string(),
          title: z.string(),
          paragraphs: z.array(z.string()).optional(),
          bullets: z.array(z.string()).optional(),
          subsections: z.array(z.object({
            title: z.string(),
            paragraphs: z.array(z.string()).optional(),
            bullets: z.array(z.string()).optional()
          })).optional()
        }))
      })
    }),
    homeEn: defineCollection({
      type: 'data',
      source: 'en/home.yml',
      schema: homeEnSchema
    }),
    servicesEn: defineCollection({
      type: 'data',
      source: 'en/services.yml',
      schema: servicesEnSchema
    }),
    approachEn: defineCollection({
      type: 'data',
      source: 'en/approach.yml',
      schema: approachEnSchema
    }),
    contactEn: defineCollection({
      type: 'data',
      source: 'en/contact.yml',
      schema: contactEnSchema
    }),
    privacyEn: defineCollection({
      type: 'data',
      source: 'en/privacy.yml',
      schema: privacyEnSchema
    })
  }
})
