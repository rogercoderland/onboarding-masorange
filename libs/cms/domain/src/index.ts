// Domain model + schemas for the CMS (page → blocks → devices).
export * from './lib/models/cms-page.model';
export * from './lib/schemas/cms-block.schema';

// Driven port implemented by cms-infrastructure.
export * from './lib/ports/cms-repository.port';
