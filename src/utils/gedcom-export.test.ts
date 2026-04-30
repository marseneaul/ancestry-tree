import { describe, expect, it } from 'vitest';
import { Person, Sex } from '../interfaces/person';
import { exportPersonToGEDCOM, getGEDCOMExportSummary } from './gedcom-export';

describe('exportPersonToGEDCOM', () => {
  const familyTree: Person = {
    name: 'Child Example',
    sex: Sex.FEMALE,
    birthDate: '2000-01-02',
    birthPlace: 'Boston, Massachusetts, United States',
    story: 'A short note.',
    parents: [
      {
        name: 'Mother Example',
        sex: Sex.FEMALE,
        birthDate: '1970',
        birthPlace: 'Canada'
      },
      {
        name: 'Father Example',
        sex: Sex.MALE,
        birthDate: '1968',
        birthPlace: 'France'
      }
    ]
  };

  it('exports individuals and family relationships', () => {
    const gedcom = exportPersonToGEDCOM(familyTree, {
      sourceName: 'Test Export',
      includeStories: true
    });

    expect(gedcom).toContain('0 HEAD');
    expect(gedcom).toContain('1 SOUR Test Export');
    expect(gedcom).toContain('0 @I0001@ INDI');
    expect(gedcom).toContain('1 NAME Child /Example/');
    expect(gedcom).toContain('1 SEX F');
    expect(gedcom).toContain('2 PLAC Boston, Massachusetts, United States');
    expect(gedcom).toContain('2 CONT A short note.');
    expect(gedcom).toContain('0 @F0001@ FAM');
    expect(gedcom).toContain('1 HUSB @I0003@');
    expect(gedcom).toContain('1 WIFE @I0002@');
    expect(gedcom).toContain('1 CHIL @I0001@');
    expect(gedcom.endsWith('0 TRLR')).toBe(true);
  });

  it('omits story notes when includeStories is false', () => {
    const gedcom = exportPersonToGEDCOM(familyTree, { includeStories: false });

    expect(gedcom).not.toContain('2 CONT A short note.');
  });

  it('redacts living-person details when privacy mode asks for it', () => {
    const privateTree: Person = {
      name: 'Living Child',
      sex: Sex.FEMALE,
      birthDate: '2000-01-02',
      birthPlace: 'Boston, Massachusetts, United States',
      story: 'Private living-person note.',
      imageUrl: './images/private.jpg',
      parents: [
        {
          name: 'Deceased Parent',
          sex: Sex.FEMALE,
          birthDate: '1970',
          birthPlace: 'Canada',
          deathDate: '2020'
        }
      ]
    };

    const gedcom = exportPersonToGEDCOM(privateTree, {
      includeStories: true,
      includeImages: true,
      livingPersonPrivacy: 'redact-details',
      currentYear: 2026
    });

    expect(gedcom).toContain('1 NAME Living /Child/');
    expect(gedcom).not.toContain('Boston, Massachusetts, United States');
    expect(gedcom).not.toContain('Private living-person note.');
    expect(gedcom).not.toContain('./images/private.jpg');
    expect(gedcom).toContain('2 PLAC Canada');
    expect(gedcom).toContain('2 DATE 2020');
    expect(gedcom).toContain('1 DEAT');
  });

  it('formats common genealogy dates without timezone drift', () => {
    const datedPerson: Person = {
      name: 'Date Example',
      birthDate: '2000-01-02',
      deathDate: '2020',
      parents: [
        {
          name: 'Approximate Parent',
          birthDate: 'circa 1970'
        },
        {
          name: 'Written Parent',
          birthDate: '13 August 1968'
        }
      ]
    };

    const gedcom = exportPersonToGEDCOM(datedPerson);

    expect(gedcom).toContain('2 DATE 02 JAN 2000');
    expect(gedcom).toContain('2 DATE 2020');
    expect(gedcom).toContain('2 DATE ABT 1970');
    expect(gedcom).toContain('2 DATE 13 AUG 1968');
  });

  it('summarizes export privacy effects before generating a file', () => {
    const exportTree: Person = {
      name: 'Living Root',
      birthDate: '2000',
      story: 'Private note.',
      imageUrl: './images/living.jpg',
      parents: [
        {
          name: 'Deceased Parent',
          birthDate: '1970',
          deathDate: '2020',
          story: 'Public note.',
          imageUrl: './images/deceased.jpg'
        }
      ]
    };

    const redactedSummary = getGEDCOMExportSummary(exportTree, {
      includeStories: true,
      includeImages: true,
      livingPersonPrivacy: 'redact-details',
      currentYear: 2026
    });
    const excludedSummary = getGEDCOMExportSummary(exportTree, {
      includeStories: true,
      includeImages: true,
      livingPersonPrivacy: 'exclude',
      currentYear: 2026
    });

    expect(redactedSummary).toMatchObject({
      totalPeople: 2,
      exportedPeople: 2,
      livingPeople: 1,
      redactedLivingPeople: 1,
      storyRecords: 1,
      imageRecords: 1
    });
    expect(excludedSummary).toMatchObject({
      totalPeople: 2,
      exportedPeople: 1,
      excludedLivingPeople: 1,
      storyRecords: 1,
      imageRecords: 1
    });
  });
});
