import type { LucideIcon } from 'lucide-react';
import { FileText, Users, Landmark, Banknote, Car, Home as HomeIcon, LandPlot, BookOpen, Scale, ShieldQuestion, HelpCircle, ListChecks } from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon: LucideIcon
  category: string;
}

export const DOCUMENT_CATEGORIES = {
  DECEASED: "Deceased's Information",
  BENEFICIARIES: "Beneficiaries' Information",
  ASSETS: "Asset Information",
  LIABILITIES: "Liability Information (Optional)",
  OTHERS: "Other Documents"
};

export const DOCUMENT_CHECKLIST_ITEMS: DocumentItem[] = [
  { id: 'doc1', title: "Death Certificate (Original & Copy)", description: "Official document confirming the deceased's death.", iconName: 'FileText', category: DOCUMENT_CATEGORIES.DECEASED },
  { id: 'doc2', title: "NRIC/Passport of Deceased (Copy)", description: "Identification document of the deceased.", iconName: 'FileText', category: DOCUMENT_CATEGORIES.DECEASED },
  { id: 'doc3', title: "NRIC/Passport of All Beneficiaries (Copies)", description: "Identification documents for all heirs.", iconName: 'Users', category: DOCUMENT_CATEGORIES.BENEFICIARIES },
  { id: 'doc4', title: "Marriage Certificate (If applicable, Copy)", description: "Proof of marriage if the spouse is a beneficiary.", iconName: 'FileText', category: DOCUMENT_CATEGORIES.BENEFICIARIES },
  { id: 'doc5', title: "Birth Certificates of Children (Copies)", description: "Proof of relation for children beneficiaries.", iconName: 'Users', category: DOCUMENT_CATEGORIES.BENEFICIARIES },
  { id: 'doc6', title: "Land Title / Sale & Purchase Agreement (Original & Copy)", description: "Documents for any real estate properties.", iconName: 'LandPlot', category: DOCUMENT_CATEGORIES.ASSETS },
  { id: 'doc7', title: "Bank Account Statements (Latest)", description: "Statements for all bank accounts held by the deceased.", iconName: 'Banknote', category: DOCUMENT_CATEGORIES.ASSETS },
  { id: 'doc8', title: "Vehicle Ownership Certificate / Card (Original & Copy)", description: "Documents for any vehicles owned.", iconName: 'Car', category: DOCUMENT_CATEGORIES.ASSETS },
  { id: 'doc9', title: "ASNB/Tabung Haji/EPF Statements (Latest)", description: "Statements for investment accounts.", iconName: 'Landmark', category: DOCUMENT_CATEGORIES.ASSETS },
  { id: 'doc10', title: "Insurance Policies (If any)", description: "Details of any life insurance policies.", iconName: 'FileText', category: DOCUMENT_CATEGORIES.ASSETS },
  { id: 'doc11', title: "List of Debts (If any)", description: "Information on any outstanding debts of the deceased.", iconName: 'Banknote', category: DOCUMENT_CATEGORIES.LIABILITIES },
  { id: 'doc12', title: "Wasiat/Will (If any, Original)", description: "The deceased's will, if one exists.", iconName: 'BookOpen', category: DOCUMENT_CATEGORIES.OTHERS },
];

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  details?: string;
  iconName: string; 
}

export const ROADMAP_STEPS: RoadmapStep[] = [
  { id: 'step1', title: "Gather Information & Documents", description: "Collect all necessary documents related to the deceased, beneficiaries, assets, and liabilities.", details: "This includes death certificates, NRICs, land titles, bank statements, etc. Refer to the Document Checklist for a comprehensive list.", iconName: 'ListChecks' },
  { id: 'step2', title: "Determine Type of Estate Administration", description: "Ascertain if it's a small estate (movable + immovable assets not exceeding RM2 million, without a will for immovable assets, or any amount with a will handled by High Court/Amanah Raya).", details: "Small estates are typically handled by District Land Administrators or Amanah Raya Berhad.", iconName: 'HelpCircle' },
  { id: 'step3', title: "Identify Beneficiaries", description: "Confirm all legal heirs according to Malaysian inheritance laws (Faraid for Muslims, Distribution Act for non-Muslims) or as per the Will.", details: "This may involve creating a family tree and verifying relationships.", iconName: 'Users' },
  { id: 'step4', title: "Valuation of Assets", description: "Obtain current market values for all assets in the estate.", details: "This is crucial for the application process and distribution.", iconName: 'Banknote' },
  { id: 'step5', title: "Application Submission", description: "Submit the required application forms (e.g., Form A for Land Office) along with supporting documents.", details: "Applications are typically made to the District Land Administrator for the district where immovable property is located, or Amanah Raya Berhad.", iconName: 'FileText' },
  { id: 'step6', title: "Attend Hearing (If applicable)", description: "Attend a hearing scheduled by the Land Administrator or relevant authority.", details: "Beneficiaries and applicant may need to be present to provide testimony or clarification.", iconName: 'Landmark' },
  { id: 'step7', title: "Obtain Distribution Order / Grant of Probate / LA", description: "Receive the official order that permits the distribution of the estate.", details: "This could be a Distribution Order, Grant of Probate (if there's a will), or Letters of Administration.", iconName: 'BookOpen' },
  { id: 'step8', title: "Settle Debts and Liabilities", description: "Pay off any outstanding debts of the deceased from the estate assets.", details: "This must be done before distributing assets to beneficiaries.", iconName: 'Banknote' },
  { id: 'step9', title: "Distribute Assets to Beneficiaries", description: "Distribute the remaining assets to the rightful heirs according to the distribution order or will.", details: "Ensure all legal requirements for asset transfer are met (e.g., land transfer, vehicle ownership change).", iconName: 'HomeIcon' },
  { id: 'step10', title: "Finalize Estate Administration", description: "Complete any remaining administrative tasks and close the estate file.", details: "This may include final tax filings or notifications to relevant authorities.", iconName: 'ShieldQuestion' },
];

export interface LegalGuideTopic {
  id: string;
  title: string;
  summary: string;
  content: string[]; 
  iconName: string; // Changed from icon: LucideIcon
}

export const LEGAL_GUIDE_TOPICS: LegalGuideTopic[] = [
  {
    id: 'guide1',
    title: "Understanding Small Estates in Malaysia",
    summary: "Learn what qualifies as a small estate and the general process.",
    iconName: 'HelpCircle',
    content: [
      "A small estate in Malaysia is generally defined as an estate of a deceased person consisting wholly or partly of immovable property (land/houses) not exceeding RM2 million in total value, without a trust or will for the immovable property. If there is movable property only, any value can be considered for small estate distribution through relevant bodies.",
      "The Small Estates (Distribution) Act 1955 governs this process. The primary authority handling small estates is the District Land Administrator in the district where the immovable property is located.",
      "For estates with only movable assets, or where a will exists, other avenues like Amanah Raya Berhad or the High Court might be more appropriate."
    ]
  },
  {
    id: 'guide2',
    title: "Eligibility for Small Estate Distribution",
    summary: "Who can apply and who are the beneficiaries.",
    iconName: 'Users',
    content: [
      "Any interested party can apply for small estate distribution, including beneficiaries, creditors, or purchasers of property from the deceased.",
      "Beneficiaries are determined by Islamic Faraid law for Muslims, and the Distribution Act 1958 for non-Muslims if the deceased died intestate (without a valid will).",
      "If a valid will exists, it dictates the beneficiaries for assets covered by the will. However, for small estate procedures concerning land, the land administrator has specific powers."
    ]
  },
  {
    id: 'guide3',
    title: "Role of Amanah Raya Berhad (ARB)",
    summary: "How ARB can assist in estate administration.",
    iconName: 'Landmark',
    content: [
      "Amanah Raya Berhad (The Public Trustee Corporation) can administer estates, especially those consisting of movable property only, regardless of value, or when appointed as executor in a will.",
      "ARB provides services like petitioning for Letters of Administration, acting as administrator or trustee, and distributing assets.",
      "They can be a good option if beneficiaries are minors, incapacitated, or if there are complexities in managing the estate."
    ]
  },
  {
    id: 'guide4',
    title: "Intestacy Laws in Malaysia",
    summary: "How assets are distributed without a will.",
    iconName: 'Scale',
    content: [
      "For Muslims, assets are distributed according to Faraid principles upon death without a Wasiat (Islamic Will). A Wasiat can only dispose of up to 1/3 of the estate to non-Faraid heirs or for charitable purposes; the remaining 2/3 is subject to Faraid.",
      "For non-Muslims, the Distribution Act 1958 (as amended) outlines the hierarchy of beneficiaries: spouse, children, parents, siblings, etc.",
      "Understanding these laws is crucial for determining rightful heirs when no will is present."
    ]
  },
  {
    id: 'guide5',
    title: "The Application Process (Form A)",
    summary: "Key steps in applying for small estate distribution.",
    iconName: 'FileText',
    content: [
      "The application typically starts with filing 'Borang A' (Form A) at the relevant District Land Office or Small Estates Distribution Unit.",
      "This form requires details of the deceased, beneficiaries, assets, and liabilities.",
      "Supporting documents, as listed in our Document Checklist, must be attached.",
      "After submission, the Land Office will schedule a hearing. All relevant parties are usually required to attend."
    ]
  },
];
