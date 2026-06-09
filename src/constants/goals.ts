import { Goal } from '../types';

export const GOALS: Goal[] = [
  {
    id: 'masters-india',
    title: 'Masters in India',
    description: 'Planning for M.Tech, MBA or MSc. in top Indian institutes (IITs, IIMs, IISc).',
    icon: 'GraduationCap',
    requirements: [
      { name: '10th Marksheet', type: 'essential', category: 'education', matchPattern: '10th|SSC' },
      { name: '12th Marksheet', type: 'essential', category: 'education', matchPattern: '12th|HSC' },
      { name: 'Graduation Degree/Transcripts', type: 'essential', category: 'education', matchPattern: 'Graduation|Degree|Transcript' },
      { name: 'Entrance Exam Scorecard', type: 'essential', category: 'education', matchPattern: 'GATE|CAT|JAM|Score' },
      { name: 'Category Certificate', type: 'supporting', category: 'identity', matchPattern: 'Caste|Category|OBC|SC|ST|EWS' },
      { name: 'Aadhaar Card', type: 'essential', category: 'identity', matchPattern: 'Aadhar|Aadhaar|ID' },
      { name: 'Statement of Purpose', type: 'supporting', category: 'other', matchPattern: 'SOP' },
      { name: 'Letters of Recommendation', type: 'supporting', category: 'other', matchPattern: 'LOR' }
    ]
  },
  {
    id: 'govt-job',
    title: 'Government Job',
    description: 'Preparation and application for UPSC, SSC, Banking, or State PSC roles.',
    icon: 'Briefcase',
    requirements: [
      { name: '10th Marksheet (Age Proof)', type: 'essential', category: 'education', matchPattern: '10th|SSC|Birth' },
      { name: 'Educational Certificates', type: 'essential', category: 'education', matchPattern: 'Graduation|Degree' },
      { name: 'Caste/Category Certificate', type: 'essential', category: 'identity', matchPattern: 'Caste|Category' },
      { name: 'Domicile Certificate', type: 'essential', category: 'identity', matchPattern: 'Domicile|Residence' },
      { name: 'Aadhaar Card', type: 'essential', category: 'identity', matchPattern: 'Aadhar|Aadhaar' },
      { name: 'Passport Size Photo', type: 'supporting', category: 'other', matchPattern: 'Photo|Photograph' },
      { name: 'Experience Certificate', type: 'supporting', category: 'job', matchPattern: 'Exp|Experience|Relieving' }
    ]
  },
  {
    id: 'education-loan',
    title: 'Education Loan',
    description: 'Securing financial support for your higher education journey.',
    icon: 'Wallet',
    requirements: [
      { name: 'Admission Proof (Offer Letter)', type: 'essential', category: 'education', matchPattern: 'Admission|Offer|Letter' },
      { name: 'Fee Structure', type: 'essential', category: 'education', matchPattern: 'Fee|Structure' },
      { name: 'Academic Records (All levels)', type: 'essential', category: 'education', matchPattern: '10th|12th|Degree' },
      { name: 'PAN Card (Self & Parent)', type: 'essential', category: 'identity', matchPattern: 'PAN' },
      { name: 'Aadhaar Card', type: 'essential', category: 'identity', matchPattern: 'Aadhar|Aadhaar' },
      { name: 'Income Proof (Co-applicant)', type: 'essential', category: 'other', matchPattern: 'Income|ITR|Salary' },
      { name: 'Bank Statement (6 months)', type: 'supporting', category: 'job', matchPattern: 'Bank|Statement' }
    ]
  }
];
