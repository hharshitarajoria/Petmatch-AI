import bcrypt from 'bcrypt';
import {
  ActivityLevel,
  AdoptionRequestStatus,
  ChatType,
  Gender,
  HomeType,
  PetExperience,
  PetSize,
  PetStatus,
  ReportStatus,
  SpaceRequirement,
  UserRole,
  VerificationStatus,
} from '@prisma/client';
import { prisma, disconnectDatabase } from '../src/config/prisma';

const SALT_ROUNDS = 12;

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

// ---------------------------------------------------------------------------
// Users (Admin, Shelters, Adopters)
// ---------------------------------------------------------------------------

async function seedUsers() {
  console.log('Seeding users...');

  const adminPasswordHash = await hashPassword('Admin@123');
  const shelterPasswordHash = await hashPassword('Shelter@123');
  const adopterPasswordHash = await hashPassword('Adopter@123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@petmatch.ai' },
    update: {},
    create: {
      name: 'PetMatch Admin',
      email: 'admin@petmatch.ai',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      city: 'Austin',
    },
  });

  const shelterUser1 = await prisma.user.upsert({
    where: { email: 'shelter1@petmatch.ai' },
    update: {},
    create: {
      name: 'Happy Tails Shelter',
      email: 'shelter1@petmatch.ai',
      passwordHash: shelterPasswordHash,
      role: UserRole.SHELTER,
      phoneNumber: '+1-512-555-0101',
      city: 'Austin',
      profilePicture: 'https://placehold.co/400x400.png?text=Happy+Tails',
    },
  });

  const shelterUser2 = await prisma.user.upsert({
    where: { email: 'shelter2@petmatch.ai' },
    update: {},
    create: {
      name: 'Second Chance Rescue',
      email: 'shelter2@petmatch.ai',
      passwordHash: shelterPasswordHash,
      role: UserRole.SHELTER,
      phoneNumber: '+1-303-555-0102',
      city: 'Denver',
      profilePicture: 'https://placehold.co/400x400.png?text=Second+Chance',
    },
  });

  const adopter1 = await prisma.user.upsert({
    where: { email: 'adopter1@petmatch.ai' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'adopter1@petmatch.ai',
      passwordHash: adopterPasswordHash,
      role: UserRole.ADOPTER,
      city: 'Austin',
      phoneNumber: '+1-512-555-0201',
    },
  });

  const adopter2 = await prisma.user.upsert({
    where: { email: 'adopter2@petmatch.ai' },
    update: {},
    create: {
      name: 'Jamie Smith',
      email: 'adopter2@petmatch.ai',
      passwordHash: adopterPasswordHash,
      role: UserRole.ADOPTER,
      city: 'Denver',
      phoneNumber: '+1-303-555-0202',
    },
  });

  const adopter3 = await prisma.user.upsert({
    where: { email: 'adopter3@petmatch.ai' },
    update: {},
    create: {
      name: 'Morgan Lee',
      email: 'adopter3@petmatch.ai',
      passwordHash: adopterPasswordHash,
      role: UserRole.ADOPTER,
      city: 'Austin',
      phoneNumber: '+1-512-555-0203',
    },
  });

  console.log('Seeded 6 users (1 admin, 2 shelters, 3 adopters).');

  return { admin, shelterUser1, shelterUser2, adopter1, adopter2, adopter3 };
}

// ---------------------------------------------------------------------------
// Shelter profiles
// ---------------------------------------------------------------------------

async function seedShelters(shelterUser1Id: string, shelterUser2Id: string): Promise<void> {
  console.log('Seeding shelter profiles...');

  await prisma.shelter.upsert({
    where: { userId: shelterUser1Id },
    update: {},
    create: {
      userId: shelterUser1Id,
      shelterName: 'Happy Tails Shelter',
      description: 'A no-kill shelter dedicated to finding loving homes for dogs and cats.',
      address: '123 Bark Ave',
      city: 'Austin',
      verificationStatus: VerificationStatus.VERIFIED,
      rating: 4.8,
    },
  });

  await prisma.shelter.upsert({
    where: { userId: shelterUser2Id },
    update: {},
    create: {
      userId: shelterUser2Id,
      shelterName: 'Second Chance Rescue',
      description: 'Rescuing and rehoming pets of all shapes and sizes since 2015.',
      address: '456 Purr Street',
      city: 'Denver',
      verificationStatus: VerificationStatus.VERIFIED,
      rating: 4.6,
    },
  });

  console.log('Seeded 2 shelter profiles.');
}

// ---------------------------------------------------------------------------
// User preferences
// ---------------------------------------------------------------------------

async function seedUserPreferences(
  adopter1Id: string,
  adopter2Id: string,
  adopter3Id: string
): Promise<void> {
  console.log('Seeding user preferences...');

  await prisma.userPreference.upsert({
    where: { userId: adopter1Id },
    update: {},
    create: {
      userId: adopter1Id,
      homeType: HomeType.APARTMENT,
      activityLevel: ActivityLevel.LOW,
      monthlyBudget: 50,
      workingHours: 9,
      hasChildren: false,
      hasOtherPets: false,
      petExperience: PetExperience.BEGINNER,
      preferredSpecies: 'Cat',
      preferredPetSize: PetSize.SMALL,
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: adopter2Id },
    update: {},
    create: {
      userId: adopter2Id,
      homeType: HomeType.HOUSE,
      activityLevel: ActivityLevel.HIGH,
      monthlyBudget: 150,
      workingHours: 4,
      hasChildren: true,
      hasOtherPets: true,
      petExperience: PetExperience.EXPERIENCED,
      preferredSpecies: 'Dog',
      preferredPetSize: PetSize.LARGE,
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: adopter3Id },
    update: {},
    create: {
      userId: adopter3Id,
      homeType: HomeType.FARM,
      activityLevel: ActivityLevel.MEDIUM,
      monthlyBudget: 100,
      workingHours: 6,
      hasChildren: false,
      hasOtherPets: true,
      petExperience: PetExperience.INTERMEDIATE,
      preferredSpecies: null,
      preferredPetSize: PetSize.ANY,
    },
  });

  console.log('Seeded 3 user preferences.');
}

// ---------------------------------------------------------------------------
// Species + Breeds
// ---------------------------------------------------------------------------

interface BreedSeed {
  name: string;
  energyLevel: ActivityLevel;
  noiseLevel: ActivityLevel;
  groomingLevel: ActivityLevel;
  spaceRequirement: SpaceRequirement;
  averageMonthlyCost: number;
  childFriendly: boolean;
  apartmentFriendly: boolean;
}

interface SpeciesSeed {
  name: string;
  description: string;
  breeds: BreedSeed[];
}

const SPECIES_SEED: SpeciesSeed[] = [
  {
    name: 'Dog',
    description: 'Loyal and social companions available in many breeds and sizes.',
    breeds: [
      { name: 'Labrador Retriever', energyLevel: ActivityLevel.HIGH, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.LARGE, averageMonthlyCost: 80, childFriendly: true, apartmentFriendly: false },
      { name: 'Golden Retriever', energyLevel: ActivityLevel.HIGH, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.HIGH, spaceRequirement: SpaceRequirement.LARGE, averageMonthlyCost: 85, childFriendly: true, apartmentFriendly: false },
      { name: 'German Shepherd', energyLevel: ActivityLevel.HIGH, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.LARGE, averageMonthlyCost: 90, childFriendly: true, apartmentFriendly: false },
      { name: 'Beagle', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.HIGH, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 60, childFriendly: true, apartmentFriendly: true },
      { name: 'Pug', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 55, childFriendly: true, apartmentFriendly: true },
      { name: 'Poodle', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.HIGH, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 75, childFriendly: true, apartmentFriendly: true },
    ],
  },
  {
    name: 'Cat',
    description: 'Independent and affectionate pets that adapt well to indoor living.',
    breeds: [
      { name: 'Persian', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.HIGH, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 50, childFriendly: true, apartmentFriendly: true },
      { name: 'Siamese', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.HIGH, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 45, childFriendly: true, apartmentFriendly: true },
      { name: 'Maine Coon', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 55, childFriendly: true, apartmentFriendly: true },
      { name: 'Bengal', energyLevel: ActivityLevel.HIGH, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 60, childFriendly: false, apartmentFriendly: true },
      { name: 'British Shorthair', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 50, childFriendly: true, apartmentFriendly: true },
    ],
  },
  {
    name: 'Rabbit',
    description: 'Gentle, quiet pets that are great for smaller living spaces.',
    breeds: [
      { name: 'Holland Lop', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 30, childFriendly: true, apartmentFriendly: true },
      { name: 'Netherland Dwarf', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 25, childFriendly: false, apartmentFriendly: true },
      { name: 'Rex', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 28, childFriendly: true, apartmentFriendly: true },
      { name: 'Lionhead', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.HIGH, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 32, childFriendly: true, apartmentFriendly: true },
    ],
  },
  {
    name: 'Bird',
    description: 'Intelligent and vocal companions that thrive with social interaction.',
    breeds: [
      { name: 'Budgerigar', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 20, childFriendly: true, apartmentFriendly: true },
      { name: 'Cockatiel', energyLevel: ActivityLevel.MEDIUM, noiseLevel: ActivityLevel.HIGH, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 25, childFriendly: true, apartmentFriendly: true },
      { name: 'African Grey Parrot', energyLevel: ActivityLevel.HIGH, noiseLevel: ActivityLevel.HIGH, groomingLevel: ActivityLevel.MEDIUM, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 60, childFriendly: false, apartmentFriendly: true },
      { name: 'Canary', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.MEDIUM, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 18, childFriendly: true, apartmentFriendly: true },
    ],
  },
  {
    name: 'Fish',
    description: 'Low-maintenance aquatic pets ideal for calming home environments.',
    breeds: [
      { name: 'Betta', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 10, childFriendly: true, apartmentFriendly: true },
      { name: 'Goldfish', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 12, childFriendly: true, apartmentFriendly: true },
      { name: 'Guppy', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.SMALL, averageMonthlyCost: 8, childFriendly: true, apartmentFriendly: true },
      { name: 'Angelfish', energyLevel: ActivityLevel.LOW, noiseLevel: ActivityLevel.LOW, groomingLevel: ActivityLevel.LOW, spaceRequirement: SpaceRequirement.MEDIUM, averageMonthlyCost: 15, childFriendly: true, apartmentFriendly: true },
    ],
  },
];

async function seedSpeciesAndBreeds(): Promise<Map<string, { id: string; speciesId: string }>> {
  console.log('Seeding species and breeds...');

  const breedInfoByName = new Map<string, { id: string; speciesId: string }>();
  let speciesCount = 0;
  let breedCount = 0;

  for (const speciesSeed of SPECIES_SEED) {
    const species = await prisma.species.upsert({
      where: { name: speciesSeed.name },
      update: {},
      create: {
        name: speciesSeed.name,
        description: speciesSeed.description,
      },
    });
    speciesCount += 1;

    for (const breedSeed of speciesSeed.breeds) {
      const breed = await prisma.breed.upsert({
        where: { speciesId_name: { speciesId: species.id, name: breedSeed.name } },
        update: {},
        create: {
          speciesId: species.id,
          name: breedSeed.name,
          energyLevel: breedSeed.energyLevel,
          noiseLevel: breedSeed.noiseLevel,
          groomingLevel: breedSeed.groomingLevel,
          spaceRequirement: breedSeed.spaceRequirement,
          averageMonthlyCost: breedSeed.averageMonthlyCost,
          childFriendly: breedSeed.childFriendly,
          apartmentFriendly: breedSeed.apartmentFriendly,
        },
      });
      breedInfoByName.set(breedSeed.name, { id: breed.id, speciesId: species.id });
      breedCount += 1;
    }
  }

  console.log(`Seeded ${speciesCount} species and ${breedCount} breeds.`);

  return breedInfoByName;
}

// ---------------------------------------------------------------------------
// Pets + Pet images
// ---------------------------------------------------------------------------

interface PetSeed {
  id: string;
  ownerUserKey: 'shelter1' | 'shelter2';
  breedName: string;
  name: string;
  age: number;
  gender: Gender;
  description: string;
  monthlyCost: number;
  vaccinated: boolean;
  sterilized: boolean;
  status: PetStatus;
  imageUrls: string[];
}

const PET_SEED: PetSeed[] = [
  { id: 'seed-pet-01', ownerUserKey: 'shelter1', breedName: 'Labrador Retriever', name: 'Max', age: 24, gender: Gender.MALE, description: 'Friendly and energetic, loves fetch and long walks.', monthlyCost: 80, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Max'] },
  { id: 'seed-pet-02', ownerUserKey: 'shelter1', breedName: 'Golden Retriever', name: 'Bella', age: 18, gender: Gender.FEMALE, description: 'Sweet-natured and great with kids.', monthlyCost: 85, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Bella'] },
  { id: 'seed-pet-03', ownerUserKey: 'shelter1', breedName: 'German Shepherd', name: 'Rex', age: 36, gender: Gender.MALE, description: 'Loyal and protective, needs an active household.', monthlyCost: 90, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Rex'] },
  { id: 'seed-pet-04', ownerUserKey: 'shelter1', breedName: 'Beagle', name: 'Daisy', age: 12, gender: Gender.FEMALE, description: 'Curious and playful, gets along with other pets.', monthlyCost: 60, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Daisy'] },
  { id: 'seed-pet-05', ownerUserKey: 'shelter1', breedName: 'Pug', name: 'Milo', age: 30, gender: Gender.MALE, description: 'Laid-back lap dog, perfect for apartment living.', monthlyCost: 55, vaccinated: true, sterilized: true, status: PetStatus.PENDING, imageUrls: ['https://placehold.co/600x400.png?text=Milo'] },
  { id: 'seed-pet-06', ownerUserKey: 'shelter1', breedName: 'Poodle', name: 'Coco', age: 20, gender: Gender.FEMALE, description: 'Smart and hypoallergenic, easy to train.', monthlyCost: 75, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Coco'] },
  { id: 'seed-pet-07', ownerUserKey: 'shelter1', breedName: 'Persian', name: 'Luna', age: 15, gender: Gender.FEMALE, description: 'Calm and affectionate, enjoys quiet spaces.', monthlyCost: 50, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Luna'] },
  { id: 'seed-pet-08', ownerUserKey: 'shelter1', breedName: 'Siamese', name: 'Simon', age: 22, gender: Gender.MALE, description: 'Vocal and social, loves attention.', monthlyCost: 45, vaccinated: true, sterilized: false, status: PetStatus.ADOPTED, imageUrls: ['https://placehold.co/600x400.png?text=Simon'] },
  { id: 'seed-pet-09', ownerUserKey: 'shelter1', breedName: 'Maine Coon', name: 'Oliver', age: 10, gender: Gender.MALE, description: 'Gentle giant, great with families.', monthlyCost: 55, vaccinated: false, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Oliver'] },
  { id: 'seed-pet-10', ownerUserKey: 'shelter1', breedName: 'Bengal', name: 'Shadow', age: 14, gender: Gender.MALE, description: 'Athletic and playful, needs enrichment toys.', monthlyCost: 60, vaccinated: true, sterilized: true, status: PetStatus.REMOVED, imageUrls: ['https://placehold.co/600x400.png?text=Shadow'] },
  { id: 'seed-pet-11', ownerUserKey: 'shelter2', breedName: 'British Shorthair', name: 'Chloe', age: 26, gender: Gender.FEMALE, description: 'Easygoing and cuddly, perfect lap cat.', monthlyCost: 50, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Chloe'] },
  { id: 'seed-pet-12', ownerUserKey: 'shelter2', breedName: 'Holland Lop', name: 'Thumper', age: 8, gender: Gender.MALE, description: 'Sweet-tempered bunny that loves to be held.', monthlyCost: 30, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Thumper'] },
  { id: 'seed-pet-13', ownerUserKey: 'shelter2', breedName: 'Netherland Dwarf', name: 'Snowball', age: 6, gender: Gender.FEMALE, description: 'Tiny and energetic, needs supervised playtime.', monthlyCost: 25, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Snowball'] },
  { id: 'seed-pet-14', ownerUserKey: 'shelter2', breedName: 'Rex', name: 'Peanut', age: 9, gender: Gender.MALE, description: 'Velvety soft coat, calm demeanor.', monthlyCost: 28, vaccinated: true, sterilized: true, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Peanut'] },
  { id: 'seed-pet-15', ownerUserKey: 'shelter2', breedName: 'Lionhead', name: 'Clover', age: 11, gender: Gender.FEMALE, description: 'Fluffy mane and a gentle personality.', monthlyCost: 32, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Clover'] },
  { id: 'seed-pet-16', ownerUserKey: 'shelter2', breedName: 'Budgerigar', name: 'Sky', age: 5, gender: Gender.MALE, description: 'Chatty and colorful, loves company.', monthlyCost: 20, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Sky'] },
  { id: 'seed-pet-17', ownerUserKey: 'shelter2', breedName: 'Cockatiel', name: 'Sunny', age: 7, gender: Gender.FEMALE, description: 'Loves to whistle and mimic sounds.', monthlyCost: 25, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Sunny'] },
  { id: 'seed-pet-18', ownerUserKey: 'shelter2', breedName: 'African Grey Parrot', name: 'Einstein', age: 24, gender: Gender.MALE, description: 'Remarkably intelligent, knows over 50 words.', monthlyCost: 60, vaccinated: true, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Einstein'] },
  { id: 'seed-pet-19', ownerUserKey: 'shelter2', breedName: 'Betta', name: 'Bubbles', age: 4, gender: Gender.UNKNOWN, description: 'Vibrant colors, low maintenance tank pet.', monthlyCost: 10, vaccinated: false, sterilized: false, status: PetStatus.AVAILABLE, imageUrls: ['https://placehold.co/600x400.png?text=Bubbles'] },
  { id: 'seed-pet-20', ownerUserKey: 'shelter2', breedName: 'Goldfish', name: 'Goldie', age: 3, gender: Gender.UNKNOWN, description: 'Classic and hardy, great for beginners.', monthlyCost: 12, vaccinated: false, sterilized: false, status: PetStatus.ADOPTED, imageUrls: ['https://placehold.co/600x400.png?text=Goldie'] },
];

async function seedPets(
  shelterUser1Id: string,
  shelterUser2Id: string,
  breedInfoByName: Map<string, { id: string; speciesId: string }>
): Promise<void> {
  console.log('Seeding pets and pet images...');

  let petCount = 0;
  let imageCount = 0;

  for (const petSeed of PET_SEED) {
    const breedInfo = breedInfoByName.get(petSeed.breedName);
    if (!breedInfo) {
      throw new Error(`Breed not found while seeding pet "${petSeed.name}": ${petSeed.breedName}`);
    }

    const ownerId = petSeed.ownerUserKey === 'shelter1' ? shelterUser1Id : shelterUser2Id;

    await prisma.pet.upsert({
      where: { id: petSeed.id },
      update: {},
      create: {
        id: petSeed.id,
        ownerId,
        speciesId: breedInfo.speciesId,
        breedId: breedInfo.id,
        name: petSeed.name,
        age: petSeed.age,
        gender: petSeed.gender,
        description: petSeed.description,
        monthlyCost: petSeed.monthlyCost,
        vaccinated: petSeed.vaccinated,
        sterilized: petSeed.sterilized,
        status: petSeed.status,
      },
    });
    petCount += 1;

    for (let i = 0; i < petSeed.imageUrls.length; i += 1) {
      const imageId = `${petSeed.id}-image-${i + 1}`;
      await prisma.petImage.upsert({
        where: { id: imageId },
        update: {},
        create: {
          id: imageId,
          petId: petSeed.id,
          imageUrl: petSeed.imageUrls[i],
        },
      });
      imageCount += 1;
    }
  }

  console.log(`Seeded ${petCount} pets and ${imageCount} pet images.`);
}
const RECOMMENDATION_REASON = [
  "Excellent match for your lifestyle.",
  "Fits your monthly budget.",
  "Matches your preferred activity level.",
  "Suitable for apartment living.",
  "Great choice based on your experience level.",
];

function randomReason() {
  return RECOMMENDATION_REASON[
    Math.floor(Math.random() * RECOMMENDATION_REASON.length)
  ];
}
async function seedRecommendations() {

    console.log("Seeding recommendations...");

    const adopters = await prisma.user.findMany({
        where:{
            role:UserRole.ADOPTER
        }
    });

    const pets = await prisma.pet.findMany({
        where:{
            status:PetStatus.AVAILABLE
        }
    });

    let count=0;

    for(const adopter of adopters){

        const shuffled=[...pets].sort(()=>Math.random()-0.5);

        const selected=shuffled.slice(0,5);

        for(const pet of selected){

            await prisma.recommendation.upsert({

                where:{
                    userId_petId:{
                        userId:adopter.id,
                        petId:pet.id
                    }
                },

                update:{},

                create:{
                    userId:adopter.id,
                    petId:pet.id,
                    compatibilityScore:
                        75+Math.floor(Math.random()*26),
                    reason:randomReason()
                }

            });

            count++;

        }

    }

    console.log(`Seeded ${count} recommendations.`);
}

async function seedSavedPets(){

    console.log("Seeding saved pets...");

    const adopters=await prisma.user.findMany({
        where:{
            role:UserRole.ADOPTER
        }
    });

    let count=0;

    for(const adopter of adopters){

        const recs=await prisma.recommendation.findMany({

            where:{
                userId:adopter.id
            },

            take:2

        });

        for(const rec of recs){

            await prisma.savedPet.upsert({

                where:{
                    userId_petId:{
                        userId:adopter.id,
                        petId:rec.petId
                    }
                },

                update:{},

                create:{
                    userId:adopter.id,
                    petId:rec.petId
                }

            });

            count++;

        }

    }

    console.log(`Seeded ${count} saved pets.`);
}

async function seedAdoptionRequests() {
  console.log("Seeding adoption requests...");

  const adopters = await prisma.user.findMany({
    where: {
      role: UserRole.ADOPTER,
    },
  });

  const pets = await prisma.pet.findMany({
    where: {
      status: PetStatus.AVAILABLE,
    },
  });

  const statuses = [
    AdoptionRequestStatus.ACCEPTED,
    AdoptionRequestStatus.PENDING,
    AdoptionRequestStatus.REJECTED,
    AdoptionRequestStatus.CANCELLED,
  ];

  let count = 0;

  for (const adopter of adopters) {
    // Pets not owned by this adopter
    const candidatePets = pets.filter(
      (pet) => pet.ownerId !== adopter.id
    );

    if (candidatePets.length === 0) continue;

    // Give each adopter two requests
    const selectedPets = candidatePets
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    for (let i = 0; i < selectedPets.length; i++) {
      const pet = selectedPets[i];

      // Check if request already exists
      const existing = await prisma.adoptionRequest.findFirst({
        where: {
          requesterId: adopter.id,
          petId: pet.id,
        },
      });

      if (existing) continue;

      await prisma.adoptionRequest.create({
        data: {
          requesterId: adopter.id,
          petId: pet.id,
          message: `Hi! I would love to adopt ${pet.name}.`,
          trustScore: 70 + Math.floor(Math.random() * 31),
          status: statuses[(count + i) % statuses.length],
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} adoption requests.`);
}

async function seedMessages() {
  console.log("Seeding messages...");

  const conversations = await prisma.conversation.findMany();

  const ownerMessages = [
    "Hello! Thank you for showing interest in this pet.",
    "The pet is healthy and fully vaccinated.",
    "Would you like to schedule a visit?",
    "Let me know if you have any questions.",
    "Looking forward to meeting you.",
  ];

  const adopterMessages = [
    "Hi! I absolutely love this pet.",
    "Is the pet good with children?",
    "Can I visit this weekend?",
    "Thank you for accepting my request.",
    "I'm excited to meet the pet!",
  ];

  let count = 0;

  for (const conversation of conversations) {
    const existing = await prisma.message.count({
      where: {
        conversationId: conversation.id,
      },
    });

    if (existing > 0) continue;

    for (let i = 0; i < 6; i++) {
      const senderId =
        i % 2 === 0
          ? conversation.adopterId
          : conversation.ownerId;

      const text =
        i % 2 === 0
          ? adopterMessages[i % adopterMessages.length]
          : ownerMessages[i % ownerMessages.length];

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId,
          message: text,
          isRead: i < 4,
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} messages.`);
}

async function seedNotifications() {
  console.log("Seeding notifications...");

  const users = await prisma.user.findMany();

  const notifications = [
    {
      title: "Recommendation Ready",
      message: "We found pets that match your preferences.",
    },
    {
      title: "Adoption Request",
      message: "Your adoption request has been received.",
    },
    {
      title: "Request Accepted",
      message: "Congratulations! Your adoption request was accepted.",
    },
    {
      title: "New Message",
      message: "You have received a new chat message.",
    },
    {
      title: "Profile Updated",
      message: "Your profile has been updated successfully.",
    },
  ];

  let count = 0;

  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      const item = notifications[(count + i) % notifications.length];

      const exists = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          title: item.title,
          message: item.message,
        },
      });

      if (exists) continue;

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: item.title,
          message: item.message,
          isRead: Math.random() > 0.5,
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} notifications.`);
}
async function seedReports() {
  console.log("Seeding reports...");

  const adopters = await prisma.user.findMany({
    where: {
      role: UserRole.ADOPTER,
    },
  });

  const pets = await prisma.pet.findMany();

  const reasons = [
    "Incorrect pet information.",
    "Images do not match the pet.",
    "Pet listing appears duplicated.",
    "Suspicious adoption listing.",
    "Description contains misleading information.",
  ];

  const statuses = [
    ReportStatus.OPEN,
    ReportStatus.UNDER_REVIEW,
    ReportStatus.RESOLVED,
    ReportStatus.DISMISSED,
  ];

  let count = 0;

  for (const adopter of adopters) {
    const selectedPets = [...pets]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    for (let i = 0; i < selectedPets.length; i++) {
      const pet = selectedPets[i];

      const existing = await prisma.report.findFirst({
        where: {
          reporterId: adopter.id,
          petId: pet.id,
        },
      });

      if (existing) continue;

      await prisma.report.create({
        data: {
          reporterId: adopter.id,
          petId: pet.id,
          reason: reasons[(count + i) % reasons.length],
          status: statuses[(count + i) % statuses.length],
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} reports.`);
}
async function seedChatHistory() {
  console.log("Seeding chat history...");

  const adopters = await prisma.user.findMany({
    where: {
      role: UserRole.ADOPTER,
    },
  });

  const chats = [
    {
      type: ChatType.RECOMMENDATION,
      user: "I live in an apartment and want a calm pet.",
      ai: "A Beagle or Persian Cat would suit your lifestyle.",
    },
    {
      type: ChatType.PET_CARE,
      user: "How often should I vaccinate my dog?",
      ai: "Consult your veterinarian annually for core vaccinations.",
    },
    {
      type: ChatType.ADOPTION_ASSISTANT,
      user: "What documents are needed for adoption?",
      ai: "Typically an ID proof, address proof, and adoption agreement are required.",
    },
    {
      type: ChatType.RECOMMENDATION,
      user: "Suggest a pet for beginners.",
      ai: "Labrador Retrievers are friendly and beginner-friendly.",
    },
    {
      type: ChatType.PET_CARE,
      user: "How much exercise does a Golden Retriever need?",
      ai: "Around 60–90 minutes of exercise every day.",
    },
  ];

  let count = 0;

  for (const adopter of adopters) {
    for (const chat of chats) {
      const existing = await prisma.chatHistory.findFirst({
        where: {
          userId: adopter.id,
          message: chat.user,
        },
      });

      if (existing) continue;

      await prisma.chatHistory.create({
        data: {
          userId: adopter.id,
          chatType: chat.type,
          message: chat.user,
          response: chat.ai,
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} chat history records.`);
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Starting PetMatch AI database seed (Part 1)...\n');

  const { admin, shelterUser1, shelterUser2, adopter1, adopter2, adopter3 } = await seedUsers();

  await seedShelters(shelterUser1.id, shelterUser2.id);
  await seedUserPreferences(adopter1.id, adopter2.id, adopter3.id);

  const breedInfoByName = await seedSpeciesAndBreeds();

  await seedPets(shelterUser1.id, shelterUser2.id, breedInfoByName);

  await seedRecommendations();

  await seedSavedPets();
  await seedAdoptionRequests();
  await seedConversations();
  await seedMessages();
  await seedNotifications();
  await seedReports();
  await seedChatHistory();
  console.log('\nSeed (Part 1) completed successfully.');
  console.log(`Admin login: admin@petmatch.ai / Admin@123 (user id: ${admin.id})`);
  console.log(`Shelter logins: shelter1@petmatch.ai / shelter2@petmatch.ai / Shelter@123`);
  console.log(`Adopter logins: adopter1@petmatch.ai / adopter2@petmatch.ai / adopter3@petmatch.ai / Adopter@123`);
}

async function seedConversations() {
  console.log("Seeding conversations...");

  const acceptedRequests = await prisma.adoptionRequest.findMany({
    where: {
      status: AdoptionRequestStatus.ACCEPTED,
    },
    include: {
      pet: true,
    },
  });

  let count = 0;

  for (const request of acceptedRequests) {
    const existingConversation =
      await prisma.conversation.findUnique({
        where: {
          adoptionRequestId: request.id,
        },
      });

    if (existingConversation) continue;

    await prisma.conversation.create({
      data: {
        petId: request.petId,
        ownerId: request.pet.ownerId,
        adopterId: request.requesterId,
        adoptionRequestId: request.id,
      },
    });

    count++;
  }

  console.log(`Seeded ${count} conversations.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
