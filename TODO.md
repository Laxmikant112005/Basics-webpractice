# Landing Page CSS/Layout Fix - TODO

## Phase 1: Fix layout structure (flex/grid overlaps) & section containers [ ]
- [ ] Wrap all sections in consistent containers: py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-4 md:px-8 lg:px-16
- [ ] Add space-y-20 wrapper between sections post-hero
- [ ] Hero search: add gap-2 px-6 py-4 to flex
- [ ] Hero stats: gap-8 md:gap-12
- [ ] Ensure all flex/grid have proper gap/item-center

## Phase 2: Standardize card layouts [✅]
- [✅] PopularDesigns cards: add flex flex-col h-full to card div
- [✅] Images: aspect-[4/3] object-cover (replace h-64)
- [✅] Content: p-4 flex flex-col flex-grow
- [✅] Titles: text-lg font-semibold mb-2 line-clamp-1 (down from xl)
- [✅] Desc: text-sm text-gray-600 flex-grow line-clamp-2
- [✅] Buttons: mt-auto w-full btn-primary
- [ ] Apply same to TopEngineers/HowItWorks cards

## Phase 3: Fix spacing and responsiveness [ ]
- [ ] Typography: h1 text-4xl md:5xl, h2 3xl md:4xl
- [ ] Consistent spacing scale across sections
- [ ] Mobile optimizations

## Phase 4: Modern styling system [ ]
- [ ] Add overflow-hidden/break-words
- [ ] Remove unused classes
- [ ] Final cleanup
- [ ] Test responsive / run dev server
- [ ] Mark complete & attempt_completion

**Current: Starting Phase 1**
