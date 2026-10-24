// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://itsbo5.github.io',
	base: '/AnyWiki',
	integrations: [
		starlight({
			title: 'AnyPS5',
			description: 'Documentation for AnyPS5: Native executable conversion and runtime libraries',
			logo: {
				alt: 'AnyPS5',
				text: 'AnyPS5',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/boykopovar/AnyPS5' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/BHFztBPUe' },
			],
			editLink: {
				baseUrl: 'https://github.com/itsbo5/AnyWiki/edit/main/',
			},
			lastUpdated: true,
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			customCss: ['./src/styles/custom.css'],
			plugins: [
				starlightLinksValidator({
					errorOnRelativeLinks: true,
				}),
			],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'Overview', slug: 'getting-started/overview' },
						{ label: 'How it works', slug: 'getting-started/how-it-works' },
						{ label: 'Platform support', slug: 'getting-started/platform-support' },
						{ label: 'Quick start', slug: 'getting-started/quick-start' },
						{ label: 'FAQ', slug: 'getting-started/faq' },
					],
				},
				{
					label: 'Install and run',
					items: [
						{ label: 'Windows', slug: 'install/windows' },
						{ label: 'Linux', slug: 'install/linux' },
						{ label: 'macOS', slug: 'install/macos' },
						{ label: 'Web converter', slug: 'install/web-converter' },
					],
				},
				{
					label: 'User guide',
					items: [
						{ label: 'Preparing input', slug: 'user-guide/preparing-input' },
						{ label: 'Converting with the relinker', slug: 'user-guide/relinker-cli' },
						{ label: 'Runtime layout', slug: 'user-guide/runtime-layout' },
						{ label: 'Input mapping', slug: 'user-guide/input-mapping' },
						{ label: 'Troubleshooting', slug: 'user-guide/troubleshooting' },
					],
				},
				{
					label: 'Compatibility',
					items: [
						{ label: 'Tracking compatibility', slug: 'compatibility/tracking' },
						{ label: 'Filing bring-up reports', slug: 'compatibility/bring-up-reports' },
						{ label: 'Progress metrics', slug: 'compatibility/progress-metrics' },
					],
				},
				{
					label: 'Architecture',
					items: [
						{ label: 'Repository map', slug: 'architecture/repository-map' },
						{ label: 'Relinker internals', slug: 'architecture/relinker-internals' },
						{ label: 'System libraries', slug: 'architecture/system-libraries' },
						{ label: 'Shader recompiler', slug: 'architecture/shader-recompiler' },
						{ label: 'Third-party dependencies', slug: 'architecture/third-party' },
						{ label: 'Technical debt', slug: 'architecture/technical-debt' },
					],
				},
				{
					label: 'Development',
					items: [
						{ label: 'Building from source', slug: 'dev/building' },
						{ label: 'Running tests and checks', slug: 'dev/tests-and-checks' },
						{ label: 'Code conventions', slug: 'dev/code-conventions' },
						{ label: 'Debugging tips', slug: 'dev/debugging' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'Workflow', slug: 'contributing/workflow' },
						{ label: 'Review criteria', slug: 'contributing/review-criteria' },
						{ label: 'Pull request checklist', slug: 'contributing/pr-checklist' },
						{ label: 'Contributors', slug: 'contributing/contributors' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Milestones and changelog', slug: 'project/changelog' },
						{ label: 'License and legal notice', slug: 'project/license' },
						{ label: 'Community', slug: 'project/community' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Library model', slug: 'reference/library-model' },
						{ label: 'Library index', slug: 'reference/libraries' },
						{ label: 'System calls', slug: 'reference/syscalls' },
						{ label: 'Relinker pipeline', slug: 'reference/relinker-pipeline' },
						{ label: 'CMake options', slug: 'reference/cmake-options' },
						{ label: 'Tools', slug: 'reference/tools' },
						{ label: 'Shader recompiler coverage', slug: 'reference/shader-coverage' },
						{ label: 'Third-party dependencies', slug: 'reference/third-party-deps' },
						{ label: 'Error index', slug: 'reference/error-index' },
						{ label: 'Anatomy of a converted game', slug: 'reference/anatomy-of-a-converted-game' },
						{ label: 'Glossary', slug: 'reference/glossary' },
						{ label: 'CLI cheat sheet', slug: 'reference/cli-cheat-sheet' },
					],
				},
			],
		}),
	],
});
