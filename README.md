# AstroDateSync Integration

> [!NOTE]  
> Please note that this is an experimental tool, and while it may work well in most cases, it is still under development and subject to change.

## 🤔 Description
AstroDateSync is an integration for Astro that **automatically updates** the `publishDate` field in the frontmatter of your `.mdx` files whenever they are modified, ensuring your documentation content reflects the most current update date.

## 🛠️ Installation

```bash
npm i astro-date-sync --save-dev
```

## 🧑‍🚀 Configuration

The `AstroDateSync` element exported by the library is of type [**AstroIntegration**](https://docs.astro.build/en/reference/integrations-reference/#quick-api-reference), which means it is designed to be used in the **integrations array** of your `astro.config.ts` file:

```ts
import { AstroDateSync } from 'astro-date-sync';

export default defineConfig({
    integrations: [
        AstroDateSync('src/docs')
    ]
});
```

Once our `astro.config` is configured, the library will **automatically listen for changes** in our MDX files to update their publishDate parameter.

## 📝 License

- [GNU GENERAL PUBLIC LICENSE 3.0](https://github.com/rperezll/AstroDateSync/blob/main/LICENSE)