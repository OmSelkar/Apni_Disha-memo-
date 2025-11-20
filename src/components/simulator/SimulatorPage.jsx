"use client";
import {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  isValidElement,
  cloneElement,
} from "react";
import {
  Mic,
  Volume2,
  X,
  Target,
  Users,
  GraduationCap,
  AlertTriangle,
  Globe,
  Shield,
  TrendingUp,
  MapPin,
  ArrowRight,
  ArrowDown,
  Maximize2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n"; // Your i18n config.
import FlowChart from "./FlowChart"; // Import the separated FlowChart module

// ---------------------- FIXTURES (EASY TO MODIFY) ----------------------
// Updated with comprehensive career paths data.
const STREAMS = [
  { id: "science", label: { en: "Science", hi: "साइंस", ur: "سائنس" } },
  { id: "commerce", label: { en: "Commerce", hi: "कॉमर्स", ur: "کامرس" } },
  {
    id: "arts",
    label: { en: "Arts/Humanities", hi: "आर्ट्स/मानविकी", ur: "آرٹس/انسانیات" },
  },
  {
    id: "vocational",
    label: {
      en: "Vocational/Diploma",
      hi: "व्यावसायिक/डिप्लोमा",
      ur: "ووکیشنل/ڈپلومہ",
    },
  },
  {
    id: "emerging",
    label: { en: "Emerging/New-Age", hi: "उभरते/नई-युग", ur: "ابھرتے/نیادور" },
  }, // New for cross-stream tech/creative.
  {
    id: "public_service",
    label: { en: "PublicService", hi: "सार्वजनिकसेवा", ur: "عوامیخدمت" },
  },
];

const COURSES = {
  science: [
    // PCM
    {
      id: "pcm_engineering_cs",
      label: {
        en: "ComputerScienceEngineering",
        hi: "कंप्यूटरसाइंसइंजीनियरिंग",
        ur: "کمپیوٹرسائنسانجینئرنگ",
      },
      colleges: ["IITBombay", "IIITHyderabad", "BITSPilani", "VITVellore"],
    },
    {
      id: "pcm_engineering_mechanical",
      label: {
        en: "MechanicalEngineering",
        hi: "मैकेनिकलइंजीनियरिंग",
        ur: "مکینیکلانجینئرنگ",
      },
      colleges: ["IITMadras", "IITBombay", "COEPPune", "NITTrichy"],
    },
    {
      id: "pcm_engineering_civil",
      label: {
        en: "CivilEngineering",
        hi: "सिविलइंजीनियरिंग",
        ur: "سولانجینئرنگ",
      },
      colleges: ["IITRoorkee", "NITSurathkal", "SRMUniversity", "MITPune"],
    },
    {
      id: "pcm_engineering_electrical",
      label: {
        en: "ElectricalEngineering",
        hi: "इलेक्ट्रिकलइंजीनियरिंग",
        ur: "الیکٹریکلانجینئرنگ",
      },
      colleges: ["IITDelhi", "NITWarangal", "JadavpurUniversity", "BITSPilani"],
    },
    {
      id: "pcm_engineering_electronics",
      label: {
        en: "ElectronicsEngineering",
        hi: "इलेक्ट्रॉनिक्सइंजीनियरिंग",
        ur: "الیکٹرانکسانجینئرنگ",
      },
      colleges: [
        "IITKanpur",
        "NITTrichy",
        "DelhiTechnologicalUniversity",
        "IIITDelhi",
      ],
    },
    {
      id: "pcm_engineering_aerospace",
      label: {
        en: "AerospaceEngineering",
        hi: "एयरोस्पेसइंजीनियरिंग",
        ur: "ایرواسپیسانجینئرنگ",
      },
      colleges: [
        "IITKanpur",
        "IISTThiruvananthapuram",
        "HindustanInstituteofTechnology",
        "AmityUniversity",
      ],
    },
    {
      id: "pcm_engineering_automobile",
      label: {
        en: "AutomobileEngineering",
        hi: "ऑटोमोबाइलइंजीनियरिंग",
        ur: "آٹوموبائلانجینئرنگ",
      },
      colleges: [
        "IITMadras",
        "PSGCollegeofTechnology",
        "VITVellore",
        "SRMUniversity",
      ],
    },
    {
      id: "pcm_engineering_ai_ml",
      label: {
        en: "AI&MLEngineering",
        hi: "एआईऔरएमएलइंजीनियरिंग",
        ur: "اےآئیاورایمایلانجینئرنگ",
      },
      colleges: [
        "IITHyderabad",
        "IITMadras",
        "IIITBangalore",
        "Online:UpGradAI/MLProgram",
      ],
    },
    // Technology
    {
      id: "pcm_tech_software_dev",
      label: {
        en: "SoftwareDeveloper",
        hi: "सॉफ्टवेयरडेवलपर",
        ur: "سافٹویئرڈویلپر",
      },
      colleges: [
        "IITs/NITs",
        "VITVellore",
        "IIITs",
        "Online:FreeCodeCamp/Udemy",
      ],
    },
    {
      id: "pcm_tech_data_science",
      label: { en: "DataScientist", hi: "डेटासाइंटिस्ट", ur: "ڈیٹاسائنٹسٹ" },
      colleges: [
        "IITMadrasDataScienceBSc",
        "ISIKolkata",
        "IIScBangalore",
        "Coursera–GoogleDataAnalytics",
      ],
    },
    {
      id: "pcm_tech_cybersecurity",
      label: {
        en: "CybersecurityAnalyst",
        hi: "साइबरसिक्योरिटीविश्लेषक",
        ur: "سائبرسیکورٹیتجزیہکار",
      },
      colleges: [
        "IITKanpurCybersecurityCourse",
        "EC-CouncilCEH",
        "OffensiveSecurity(OSCP)",
        "Coursera–IBMCybersecurity",
      ],
    },
    {
      id: "pcm_tech_cloud",
      label: { en: "CloudEngineer", hi: "क्लाउडइंजीनियर", ur: "کلاؤڈانجینئر" },
      colleges: [
        "AWSAcademy",
        "GoogleCloudCareerReadiness",
        "IITKharagpurCloudComputingCourse",
        "Udemy–CloudArchitect",
      ],
    },
    {
      id: "pcm_tech_game_dev",
      label: { en: "GameDeveloper", hi: "गेमडेवलपर", ur: "گیمڈویلپر" },
      colleges: [
        "NIDBangalore",
        "ICATDesign&MediaCollege",
        "ArenaAnimation",
        "Udemy/UnityLearn",
      ],
    },
    {
      id: "pcm_tech_devops",
      label: {
        en: "DevOpsEngineer",
        hi: "डेवऑप्सइंजीनियर",
        ur: "ڈیوآپسانجینئر",
      },
      colleges: [
        "IITRoorkee(GreatLearningDevOps)",
        "UpGradDevOps",
        "LinuxFoundation",
        "UdemyDevOpsMasterclass",
      ],
    },
    // Other PCM
    {
      id: "pcm_architecture",
      label: {
        en: "Architecture(B.Arch)",
        hi: "आर्किटेक्चर(बी.आर्क)",
        ur: "آرکیٹیکچر(بی.آرک)",
      },
      colleges: [
        "CEPTUniversity",
        "SchoolofPlanning&ArchitectureDelhi",
        "IITRoorkee",
        "NITCalicut",
      ],
    },
    {
      id: "pcm_pilot",
      label: { en: "CommercialPilot", hi: "कमर्शियलपायलट", ur: "کمर्शلپائلٹ" },
      colleges: [
        "IndiraGandhiRashtriyaUranAkademi(IGRUA)",
        "CAEGlobalAcademy",
        "BombayFlyingClub",
        "NFTIGondia",
      ],
    },
    {
      id: "pcm_merchant_navy",
      label: { en: "MerchantNavy", hi: "मर्चेंटनेवी", ur: "مارچنٹنیوی" },
      colleges: [
        "IndianMaritimeUniversity",
        "TMIMumbai",
        "AMETUniversity",
        "AngloEasternMaritimeAcademy",
      ],
    },
    {
      id: "pcm_defence_tech",
      label: {
        en: "Defence(NDATechnical)",
        hi: "रक्षा(एनडीएतकनीकी)",
        ur: "دفاع(اینڈیاےتکنیکی)",
      },
      colleges: [
        "NDAPune",
        "SSBCoaching–MajorKalshi",
        "SSBCrack",
        "UnacademyNDA",
      ],
    },
    // PCB
    {
      id: "pcb_mbbs",
      label: { en: "MBBSDoctor", hi: "एमबीबीएसडॉक्टर", ur: "ایمبیبیایسڈاکٹر" },
      colleges: ["AIIMSDelhi", "CMCVellore", "JIPMERPuducherry", "KEMMumbai"],
    },
    {
      id: "pcb_bds",
      label: {
        en: "BDS(Dentist)",
        hi: "बीडीएस(डेंटिस्ट)",
        ur: "بیڈیایس(ڈینٹسٹ)",
      },
      colleges: [
        "MaulanaAzadInstituteofDentalSciences",
        "ManipalCollegeofDentalSciences",
        "GovernmentDentalCollegeMumbai",
        "SRMDentalCollege",
      ],
    },
    {
      id: "pcb_ayurveda",
      label: {
        en: "BAMS/BHMS/Unani",
        hi: "बAMS/बीएचएमएस/उनानी",
        ur: "بAMS/بیایچایمایس/ونانی",
      },
      colleges: [
        "BHUVaranasi",
        "TilakAyurvedaPune",
        "NationalInstituteofAyurvedaJaipur",
        "AMUAligarh",
      ],
    },
    {
      id: "pcb_veterinary",
      label: {
        en: "Veterinary(BVSc)",
        hi: "पशुचिकित्सा(बीवीएससी)",
        ur: "ویٹرنری(بیویایسسی)",
      },
      colleges: [
        "IVRIBareilly",
        "GADVASULudhiana",
        "TANUVASChennai",
        "KVAFSUKarnataka",
      ],
    },
    {
      id: "pcb_nursing",
      label: { en: "Nursing", hi: "नर्सिंग", ur: "نرسنگ" },
      colleges: [
        "AIIMSCollegeofNursing",
        "ChristianMedicalCollege",
        "PGIMERChandigarh",
        "ApolloNursing",
      ],
    },
    // Allied Health
    {
      id: "pcb_physiotherapy",
      label: { en: "Physiotherapy", hi: "फिजियोथेरेपी", ur: "فزیوتھراپی" },
      colleges: [
        "ManipalCollegeofHealthProfessions",
        "DYPatilMumbai",
        "JamiaHamdard",
        "AmityUniversity",
      ],
    },
    {
      id: "pcb_optometry",
      label: { en: "Optometry", hi: "ऑप्टोमेट्री", ur: "آپٹومیٹری" },
      colleges: [
        "AIIMS",
        "ManipalAcademy",
        "SankaraNethralayaChennai",
        "LVPrasadHyderabad",
      ],
    },
    {
      id: "pcb_radiology",
      label: { en: "Radiology", hi: "रेडियोलॉजी", ur: "ریڈیالوجی" },
      colleges: [
        "AIIMSDelhi",
        "PGIMERChandigarh",
        "CMCVellore",
        "ManipalUniversity",
      ],
    },
    {
      id: "pcb_mlt",
      label: {
        en: "MedicalLabTechnology",
        hi: "मेडिकललैबटेक्नोलॉजी",
        ur: "میڈیکللیبٹیکنالوجی",
      },
      colleges: [
        "AIIMSDelhi",
        "ManipalCollege",
        "JIPMER",
        "St.John’sBangalore",
      ],
    },
    {
      id: "pcb_occupational",
      label: {
        en: "OccupationalTherapy",
        hi: "व्यावसायिकचिकित्सा",
        ur: "پیشہورانہتھراپی",
      },
      colleges: [
        "AIIMSDelhi",
        "NIMSHyderabad",
        "SRMUniversity",
        "JamiaHamdard",
      ],
    },
    // Research
    {
      id: "pcb_microbiology",
      label: {
        en: "Microbiology",
        hi: "माइक्रोबायोलॉजी",
        ur: "مائیکروبائیولوجی",
      },
      colleges: ["IIScBangalore", "JNUDelhi", "BHU", "LoyolaCollege"],
    },
    {
      id: "pcb_biotech",
      label: {
        en: "Biotechnology",
        hi: "बायोटेक्नोलॉजी",
        ur: "بائیوٹیکنالوجی",
      },
      colleges: ["IITBombay", "IIScBangalore", "AmityUniversity", "VITVellore"],
    },
    {
      id: "pcb_genetics",
      label: { en: "Genetics", hi: "जेनेटिक्स", ur: "جینیٹکس" },
      colleges: [
        "IIScBangalore",
        "DelhiUniversity",
        "BangaloreUniversity",
        "SRMUniversity",
      ],
    },
    {
      id: "pcb_pharmacology",
      label: { en: "Pharmacology", hi: "फार्माकोलॉजी", ur: "فارماکالوجی" },
      colleges: [
        "NIPERMohali",
        "ICTMumbai",
        "JSSCollegeofPharmacy",
        "ManipalCollegeofPharmacy",
      ],
    },
    // PCMB
    {
      id: "pcmb_bme",
      label: {
        en: "BiomedicalEngineering",
        hi: "बायोमेडिकलइंजीनियरिंग",
        ur: "بائیومیڈیکلانجینئرنگ",
      },
      colleges: [
        "IITMadras",
        "VITVellore",
        "SRMUniversity",
        "AmritaUniversity",
      ],
    },
    {
      id: "pcmb_bioinformatics",
      label: {
        en: "Bioinformatics",
        hi: "बायोइनफॉर्मेटिक्स",
        ur: "بائیوانفارمیٹکس",
      },
      colleges: ["IITDelhi", "IIITHyderabad", "IGIBDelhi", "AmityUniversity"],
    },
    {
      id: "pcmb_biotech_research",
      label: {
        en: "BiotechnologyResearch",
        hi: "बायोटेक्नोलॉजीअनुसंधान",
        ur: "بائیوٹیکنالوجیتحقیق",
      },
      colleges: ["IIScBangalore", "IISERPune", "IITDelhi", "TIFRMumbai"],
    },
  ],
  // ... (Rest of COURSES object remains the same as in the original code - commerce, arts, vocational, emerging, public_service)
  // Note: For brevity, the full COURSES object is not repeated here, but include it exactly as in the original.
};

const COLLEGE_TYPES = [
  { id: "govt", label: { en: "Government", hi: "सरकारी", ur: "حکومتی" } },
  { id: "private", label: { en: "Private", hi: "निजी", ur: "نجی" } },
  {
    id: "military_academy",
    label: { en: "MilitaryAcademy", hi: "सैन्यअकादमी", ur: "فوجیاکیڈمی" },
  }, // New for NDA/IMA.
];

const COLLEGES = {
  govt: [
    {
      id: "govt1",
      label: { en: "GovtCollegeA", hi: "सरकारीकॉलेजए", ur: "حکومتیکالجاے" },
      fees: 50000,
      cutoff: 85,
      location: "Delhi",
    },
    {
      id: "govt2",
      label: { en: "GovtCollegeB", hi: "सरकारीकॉलेजबी", ur: "حکومتیکالجبی" },
      fees: 60000,
      cutoff: 80,
      location: "Mumbai",
    },
  ],
  private: [
    {
      id: "priv1",
      label: { en: "PrivateCollegeX", hi: "निजीकॉलेजएक्स", ur: "نجیکالجایکس" },
      fees: 500000,
      cutoff: 90,
      location: "Bengaluru",
    },
  ],
  military_academy: [
    {
      id: "nda",
      label: { en: "NDAPune", hi: "एनडीएपुणे", ur: "اینڈیاےپونہ" },
      fees: 0,
      cutoff: 95,
      location: "Pune",
      exam: "NDAExam",
    },
    {
      id: "ima",
      label: { en: "IMADehradun", hi: "आईएमएदेहरादून", ur: "آئیایماےدہرادون" },
      fees: 0,
      cutoff: 92,
      location: "Dehradun",
      exam: "CDSExam",
    },
  ],
};

const SKILLS = [
  { id: "coding", label: { en: "Coding", hi: "कोडिंग", ur: "کوڈنگ" } },
  {
    id: "management",
    label: { en: "Management", hi: "प्रबंधन", ur: "مینجمنٹ" },
  },
  { id: "leadership", label: { en: "Leadership", hi: "नेतृत्व", ur: "قیادت" } },
  { id: "discipline", label: { en: "Discipline", hi: "अनुशासन", ur: "ڈسپلن" } },
  {
    id: "fitness",
    label: { en: "PhysicalFitness", hi: "शारीरिकफिटनेस", ur: "جسمانیفٹنس" },
  },
];

const SCHOLARSHIPS = [
  {
    id: "merit",
    label: {
      en: "MeritScholarship",
      hi: "मेरिटछात्रवृत्ति",
      ur: "میرٹسکالرشپ",
    },
    odds: 0.7,
    amount: 100000,
  },
  {
    id: "need_based",
    label: { en: "Need-based", hi: "आवश्यकताआधारित", ur: "ضرورتمبنی" },
    odds: 0.5,
    amount: 200000,
  },
  {
    id: "military_grant",
    label: {
      en: "DefenceScholarship",
      hi: "रक्षाछात्रवृत्ति",
      ur: "دفاعسکالرشپ",
    },
    odds: 0.6,
    amount: 150000,
    note: "ForNDA/CDSprep",
  },
];

// Perks - Enhanced with military defaults.
const PERKS = {
  jobSecurity: {
    icon: Shield,
    label: { en: "JobSecurity", hi: "नौकरीकीसुरक्षा", ur: "ملازمتکیسلامتی" },
    score: 8,
  },
  competition: {
    icon: Users,
    label: { en: "Competition", hi: "प्रतिस्पर्धा", ur: "مسابقت" },
    ratio: "1:50",
  },
  pension: {
    icon: TrendingUp,
    label: { en: "Pension", hi: "पेंशन", ur: "پنشن" },
    coverage: "80%",
  },
  startupRisk: {
    icon: AlertTriangle,
    label: { en: "StartupRisk", hi: "स्टार्टअपजोखिम", ur: "اسٹارٹاپخطرہ" },
    volatility: "High",
  },
  postings: {
    icon: MapPin,
    label: { en: "Postings", hi: "तैनाती", ur: "تعیناتی" },
    variety: "Nationwide/Global",
  },
};

// Utility functions.
function getLabel(item, lang = "en") {
  return item?.label?.[lang] ?? item?.label?.en ?? "";
}

function currency(x) {
  return `₹${Number(x).toLocaleString()}`;
}

// ---------------------- SCENARIO REDUCER ----------------------
const scenarioReducer = (state, action) => {
  switch (action.type) {
    case "ADD_SCENARIO":
      return [...state, { ...action.payload, id: Date.now() }];
    case "UPDATE_SCENARIO":
      return state.map((s) =>
        s.id === action.id ? { ...s, ...action.payload } : s
      );
    case "RESET":
      return [];
    default:
      return state;
  }
};

// ---------------------- PRESENTATIONAL COMPONENTS ----------------------
function Select({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  lang = "en",
}) {
  const { t } = useTranslation();
  return (
    <label className="block">
      <div className="text-sm text-indigo-700 mb-2 font-semibold">{label}</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl p-3 border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">{`--${t(label.toLowerCase() || "select")}--`}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {getLabel(opt, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chip({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm font-semibold border transition-all ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md"
          : "bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function StatPill({ icon: Icon, label, value }) {
  const renderIcon = () => {
    if (!Icon) return null;
    // If a React element was passed (e.g. <GraduationCap />), clone it to ensure sizing classes
    if (isValidElement(Icon)) {
      return cloneElement(Icon, {
        className: [Icon.props?.className || "", "w-5 h-5"].join(" ").trim(),
      });
    }
    // Otherwise assume a component (function/class) was passed and render it
    const IconComp = Icon;
    return <IconComp className="w-5 h-5" />;
  };

  return (
    <div className="bg-white/90 border border-indigo-200 rounded-xl px-4 py-3 shadow-md flex items-center gap-4 min-w-[110px]">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
        {renderIcon()}
      </div>
      <div className="text-right flex-grow">
        <div className="text-xs text-indigo-500 font-semibold">{label}</div>
        <div className="font-bold text-indigo-700 text-lg">{value}</div>
      </div>
    </div>
  );
}

StatPill.defaultProps = {
  icon: null,
  label: "",
  value: "",
};

function SummaryCard({ title, value, hint }) {
  return (
    <div className="border border-indigo-200 rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between gap-5 mb-2">
        <div className="text-sm font-semibold text-indigo-700">{title}</div>
        <div className="text-xs text-indigo-400 italic">{hint}</div>
      </div>
      <div className="text-2xl font-extrabold text-indigo-900">{value}</div>
    </div>
  );
}

function PerksRadar({ perks, lang }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
      {/* Adjusted cols for new perk. */}
      {Object.entries(perks).map(([key, perk]) => (
        <div
          key={key}
          className="text-center p-3 bg-indigo-50 rounded-xl border border-indigo-100"
        >
          <perk.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
          <div className="text-xs text-indigo-700 mb-1">
            {getLabel(perk.label, lang)}
          </div>
          <div className="text-sm font-bold text-indigo-900">
            {perk.score
              ? `${perk.score}/10`
              : perk.ratio || perk.coverage || perk.volatility || perk.variety}
          </div>
        </div>
      ))}
    </div>
  );
}

function AbroadModal({ isOpen, onClose, scenario }) {
  if (!isOpen) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-indigo-700">
            <Globe className="w-5 h-5 inline mr-2" />
            {t("exploreAbroad")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            For {scenario.course || "yourpath"}: ROI 1.8x, Cost ₹50L, Visa Odds
            65%.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              Top Country: USA
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              Salary Boost: +50%
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold">
            Simulate Visa Process
          </button>
        </div>
      </div>
    </div>
  );
}

function VoiceDock({ expanded, setExpanded }) {
  const { t } = useTranslation();
  if (!expanded) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-end md:items-center justify-center md:justify-end p-4">
      <div
        onClick={() => setExpanded(false)}
        className="fixed inset-0 md:hidden"
        aria-hidden="true"
      />
      <div className="w-full max-w-md md:max-w-sm bg-white rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-full text-white">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-indigo-700">
                {t("voiceAssistant")}
              </div>
              <div className="text-xs text-gray-500">{t("tryCommands")}</div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-auto">
          <p className="text-sm text-gray-600">
            Say: "Add military path" or "Explain ROI".
          </p>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => setExpanded(false)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {t("done")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- MAIN COMPONENT ----------------------
export default function SimulatorPage() {
  const { t } = useTranslation();
  const [scenarios, dispatch] = useReducer(scenarioReducer, [
    {
      id: 1,
      name: "EngineeringPath",
      stream: "science",
      course: "pcm_engineering_cs",
      collegeType: "govt",
      college: "govt1",
      skills: ["coding"],
      scholarship: "merit",
      dropout: false,
      npv: 1200000,
      roi: 1.5,
      employmentProb: 0.85,
      startingSalary: 600000,
      timeToJob: 6,
      scholarshipOdds: 0.7,
    },
    // New: Pre-loaded Military Scenarios.
    {
      id: 2,
      name: "NavyOfficerPath",
      stream: "public_service",
      course: "navy",
      collegeType: "military_academy",
      college: "nda",
      skills: ["leadership", "discipline", "fitness"],
      scholarship: "military_grant",
      dropout: false,
      npv: 1500000, // High due to pension/lifetime security.
      roi: 2.0,
      employmentProb: 0.95, // Near-guaranteed post-selection.
      startingSalary: 560000, // Lt salary.
      timeToJob: 12, // Training period.
      scholarshipOdds: 0.8,
      notes: "Pension:100%, Postings:Sea/International, Exam:TES(10+2PCB/PCM)",
    },
    {
      id: 3,
      name: "ArmyNDAPath",
      stream: "public_service",
      course: "army",
      collegeType: "military_academy",
      college: "nda",
      skills: ["leadership", "fitness"],
      scholarship: "military_grant",
      dropout: false,
      npv: 1400000,
      roi: 1.8,
      employmentProb: 0.92,
      startingSalary: 56100 * 12, // Annual.
      timeToJob: 36, // 3-yr NDA + training.
      scholarshipOdds: 0.75,
      notes: "Competition:1:200, Perks:Free education, Lifetime medical",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = scenarios[activeIndex] || scenarios[0];

  // Input states.
  const [stream, setStream] = useState(active.stream);
  const [course, setCourse] = useState(active.course);
  const [collegeType, setCollegeType] = useState(active.collegeType);
  const [college, setCollege] = useState(active.college);
  const [skills, setSkills] = useState(active.skills || []);
  const [scholarship, setScholarship] = useState(active.scholarship);
  const [dropout, setDropout] = useState(active.dropout || false);
  const [showAbroad, setShowAbroad] = useState(false);
  const [dockExpanded, setDockExpanded] = useState(false);
  const [showFullChart, setShowFullChart] = useState(false); // New for fullscreen.

  // Sync to scenarios + Military adjustments.
  useEffect(() => {
    let baseNpv = 1200000;
    let baseSalary = 600000;
    let baseProb = 0.85;
    let baseTime = 6;
    let baseRoi = 1.5;
    // Military boosts.
    if (stream === "public_service") {
      baseNpv = 1500000; // Lifetime value.
      baseSalary = 672000; // Avg officer start.
      baseProb = 0.95;
      baseTime = 12;
      baseRoi = 2.0;
    }
    const adjustedNpv = dropout ? baseNpv * 0.7 : baseNpv;
    const adjustedTime = dropout ? Math.max(3, baseTime - 2) : baseTime;
    dispatch({
      type: "UPDATE_SCENARIO",
      id: active.id,
      payload: {
        stream,
        course,
        collegeType,
        college,
        skills,
        scholarship,
        dropout,
        npv: adjustedNpv,
        roi: baseRoi,
        employmentProb: baseProb,
        startingSalary: baseSalary,
        timeToJob: adjustedTime,
        scholarshipOdds: 0.7,
        notes:
          college && COLLEGES[collegeType]?.find((c) => c.id === college)?.exam
            ? `Exam:${COLLEGES[collegeType].find((c) => c.id === college).exam}`
            : "",
      },
    });
  }, [
    stream,
    course,
    collegeType,
    college,
    skills,
    scholarship,
    dropout,
    active.id,
  ]);

  const totalPoints = useMemo(
    () =>
      scenarios.reduce((acc, s) => acc + Math.round((s.npv || 0) / 100000), 0),
    [scenarios]
  );

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ur", name: "اردو" },
  ];

  // Voice stub.
  const toggleListening = () => {
    console.log("Voice toggled");
  };

  const addScenario = () => {
    const newScenario = {
      name: `Scenario ${scenarios.length + 1}`,
      stream,
      course,
      collegeType,
      college,
      skills,
      scholarship,
      dropout,
      npv: stream === "public_service" ? 1500000 : 900000,
      roi: stream === "public_service" ? 2.0 : 1.2,
      employmentProb: stream === "public_service" ? 0.95 : 0.75,
      startingSalary: stream === "public_service" ? 672000 : 450000,
      timeToJob: stream === "public_service" ? 12 : 8,
      scholarshipOdds: 0.5,
    };
    dispatch({ type: "ADD_SCENARIO", payload: newScenario });
    setActiveIndex(scenarios.length);
  };

  const reset = () => {
    setStream("");
    setCourse("");
    setCollegeType("");
    setCollege("");
    setSkills([]);
    setScholarship("");
    setDropout(false);
    dispatch({ type: "RESET" });
  };

  // Dynamic perks for military.
  const dynamicPerks = useMemo(() => {
    const base = { ...PERKS };
    if (stream === "public_service") {
      base.jobSecurity.score = 10;
      base.pension.coverage = "100%";
      base.competition.ratio = "1:200"; // High entry, low turnover.
      base.postings.variety = "Global Deployments";
    }
    return base;
  }, [stream]);

  return (
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50/30 text-gray-900 font-sans selection:bg-indigo-300/60 selection:text-white">
    {/* HERO */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div className="rounded-2xl lg:rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 p-6 lg:p-8 shadow-xl lg:shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 text-white overflow-hidden">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-lg lg:drop-shadow-2xl leading-tight">
            {t("title", { defaultValue: "DishaLab" })}
          </h1>
          <p className="mt-4 text-base sm:text-lg max-w-2xl drop-shadow-sm leading-relaxed">
            {t("subtitle", {
              defaultValue:
                "Build scenarios, compare outcomes, show families the evidence.",
            })}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="px-3 py-2 border border-white/30 rounded-lg text-sm font-medium bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {languages.map(({ code, name }) => (
                <option key={code} value={code} className="text-gray-900">
                  {name}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer select-none transition-all duration-300 hover:scale-105">
              <input
                type="checkbox"
                checked={
                  collegeType === "govt" || collegeType === "military_academy"
                }
                onChange={(e) =>
                  setCollegeType(
                    e.target.checked ? "military_academy" : "govt"
                  )
                }
                className="h-4 w-4 rounded-lg border-2 border-white/50 bg-white/20 backdrop-blur-sm focus:ring-2 focus:ring-white/60 cursor-pointer transition-all duration-300"
              />
              <span>{t("governmentFirst", { defaultValue: "Govt/Military First" })}</span>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
          <div className="text-right lg:text-center">
            <div className="text-sm opacity-90 tracking-wide">
              {t("totalScenarios", { defaultValue: "Total Scenarios" })}
            </div>
            <div className="text-2xl lg:text-3xl font-black mt-1">{scenarios.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-lg flex items-center gap-3 lg:gap-4">
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white flex-shrink-0" />
            <div>
              <div className="text-xs opacity-90 uppercase tracking-wider">
                {t("engagement", { defaultValue: "Engagement" })}
              </div>
              <div className="font-black text-base lg:text-lg mt-0.5">
                {t("high", { defaultValue: "High" })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* MAIN LAYOUT */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT: Controls - Compact & Sticky */}
        <aside className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg lg:shadow-xl border border-indigo-100/50 lg:border-indigo-200/60 sticky lg:top-32 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-visible">
          <h3 className="text-lg lg:text-xl font-black mb-4 lg:mb-6 text-indigo-800 tracking-tight">
            {t("streamAndCourse", { defaultValue: "Stream & Course" })}
          </h3>
          <div className="space-y-4">
            <Select
              label={t("stream", { defaultValue: "Stream" })}
              value={stream}
              options={STREAMS}
              lang={i18n.language}
              onChange={setStream}
            />
            <Select
              label={t("course", { defaultValue: "Course" })}
              value={course}
              options={COURSES[stream] || []}
              lang={i18n.language}
              onChange={setCourse}
              disabled={!stream}
            />
            <Select
              label={t("collegeType", { defaultValue: "College Type" })}
              value={collegeType}
              options={COLLEGE_TYPES}
              lang={i18n.language}
              onChange={setCollegeType}
            />
            <Select
              label={t("college", { defaultValue: "College" })}
              value={college}
              options={COLLEGES[collegeType] || []}
              lang={i18n.language}
              onChange={setCollege}
              disabled={!collegeType}
            />
          </div>
          <hr className="my-4 lg:my-6 border-indigo-200/60" />
          <div>
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h4 className="font-semibold text-indigo-800 text-sm lg:text-base">
                {t("skills", { defaultValue: "Skills" })}
              </h4>
              <button
                onClick={() => setSkills([])}
                className="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors duration-300"
              >
                {t("clear", { defaultValue: "Clear" })}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 lg:gap-2.5 -m-0.5">
              {SKILLS.map((s) => (
                <Chip
                  key={s.id}
                  active={skills.includes(s.id)}
                  onClick={() =>
                    setSkills((prev) =>
                      prev.includes(s.id)
                        ? prev.filter((x) => x !== s.id)
                        : [...prev, s.id]
                    )
                  }
                  className="text-xs lg:text-sm px-2.5 lg:px-3 py-1.5 lg:py-1.5 transition-all duration-300 hover:scale-105"
                >
                  {getLabel(s, i18n.language)}
                </Chip>
              ))}
            </div>
          </div>
          {/* Dropout */}
          <div className="mt-4 p-3 lg:p-4 bg-gradient-to-br from-rose-50/80 to-red-50/80 rounded-xl border border-red-200/60">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-red-700">
              <input
                type="checkbox"
                checked={dropout}
                onChange={(e) => setDropout(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-2 focus:ring-red-500/50 rounded-lg"
              />
              {t("simulateDropout", { defaultValue: "Simulate Dropout?" })}
            </label>
            {dropout && (
              <p className="mt-2 text-xs text-red-600 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1.5 flex-shrink-0" />
                {stream === "public_service"
                  ? "Rare in military; pivot to paramilitary."
                  : "NPV -30%, Time to Job -2 months."}
              </p>
            )}
          </div>
          {/* Scholarships */}
          <div className="mt-4 lg:mt-6">
            <label className="block mb-2 lg:mb-3 font-semibold text-indigo-800 text-sm lg:text-base">
              {t("scholarships", { defaultValue: "Scholarships" })}
            </label>
            <select
              value={scholarship}
              onChange={(e) => setScholarship(e.target.value)}
              className="w-full rounded-lg p-2.5 lg:p-3 border border-indigo-300/60 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/60 text-sm transition-all duration-300"
            >
              <option value="">
                — {t("selectScholarship", { defaultValue: "Select Scholarship" })} —
              </option>
              {SCHOLARSHIPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {getLabel(s, i18n.language)} ({currency(s.amount)}, {Math.round(s.odds * 100)}% odds)
                  {s.note && ` — ${s.note}`}
                </option>
              ))}
            </select>
          </div>
          {/* Actions */}
          <div className="mt-6 lg:mt-8 flex flex-col gap-3">
            <button
              onClick={addScenario}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-2.5 lg:py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm lg:text-base"
            >
              + {t("addScenario", { defaultValue: "Add Scenario" })}
            </button>
            <button
              onClick={reset}
              className="w-full border border-indigo-300/60 rounded-xl py-2.5 lg:py-3 text-indigo-700 font-semibold hover:bg-indigo-50/60 hover:border-indigo-400/80 transition-all duration-300 text-sm lg:text-base"
            >
              {t("reset", { defaultValue: "Reset" })}
            </button>
          </div>
        </aside>

        {/* CENTER: Visualizer - Dominant Flowchart */}
        <main className="lg:col-span-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg lg:shadow-xl border border-indigo-100/50 lg:border-indigo-200/60 min-h-[500px] lg:min-h-[600px]">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 lg:mb-8">
            <div className="flex-1">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-black text-indigo-800 leading-tight tracking-tight">
                {active.name || `Scenario ${activeIndex + 1}`}
              </h2>
              <p className="mt-2 text-sm lg:text-base text-indigo-600 font-medium tracking-wide">
                {t("interactiveVisualizer", {
                  defaultValue: "Interactive Visualizer - Decision Flow Chart",
                })}
              </p>
              {active.notes && (
                <p className="mt-3 text-xs lg:text-sm text-gray-600 italic leading-relaxed">
                  {active.notes}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 lg:gap-6 flex-shrink-0">
              <StatPill
                icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
                label={t("roi", { defaultValue: "ROI" })}
                value={active.roi?.toFixed(2) ?? "-"}
              />
              <StatPill
                icon={<Users className="w-5 h-5 text-emerald-500" />}
                label={t("employmentProb", { defaultValue: "Employment" })}
                value={`${(active.employmentProb * 100).toFixed(0)}%`}
              />
            </div>
          </div>

          {/* Quick Outcomes & Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 lg:mb-10">
            {/* Salary & Time */}
            <div className="rounded-xl p-5 lg:p-6 border border-indigo-100/50 shadow-sm lg:shadow-md bg-gradient-to-br from-indigo-50/60 to-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="sm:text-center lg:text-left">
                  <div className="text-xs lg:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                    {t("startingSalary", { defaultValue: "Starting Salary" })}
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-indigo-800 mt-1 lg:mt-2 leading-tight">
                    {currency(active.startingSalary || 0)}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:text-right">
                  <div className="text-xs lg:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                    {t("timeToJob", { defaultValue: "Time to Job" })}
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-indigo-800 mt-1">
                    {active.timeToJob} {t("months", { defaultValue: "months" })}
                  </div>
                </div>
              </div>
              <p className="mt-4 lg:mt-5 text-xs lg:text-sm text-indigo-500/80 italic leading-relaxed">
                {t("includesScholarshipAssumptions", {
                  defaultValue: "Includes scholarship & upskill assumptions",
                })}
                {stream === "public_service" && " + Allowances (DA, HRA)"}
              </p>
            </div>
            {/* Perks Radar */}
            <div className="rounded-xl p-5 lg:p-6 border border-indigo-100/50 shadow-sm lg:shadow-md bg-gradient-to-br from-purple-50/60 to-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
              <PerksRadar perks={dynamicPerks} lang={i18n.language} size="lg" />
            </div>
          </div>

          {/* Flowchart */}
          <div className="relative bg-gradient-to-br from-slate-50/70 via-white/90 to-indigo-50/30 rounded-xl p-6 lg:p-8 border border-indigo-100/40 shadow-inner lg:shadow-md min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] flex items-center justify-center overflow-hidden">
            <FlowChart
              active={active}
              getLabel={getLabel}
              lang={i18n.language}
              t={t}
              dynamicPerks={dynamicPerks}
            />
            <button
              onClick={() => setShowFullChart(true)}
              className="absolute top-4 right-4 z-10 p-3 lg:p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              title="Expand to Full Screen"
            >
              <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowAbroad(true)}
              className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-3 lg:py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm lg:text-base"
            >
              <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
              {t("exploreAbroad", { defaultValue: "Explore Abroad" })}
            </button>
            <button
              className="flex-1 border-2 border-indigo-300/60 rounded-xl py-3 lg:py-3.5 text-indigo-700 font-semibold hover:bg-indigo-50/60 hover:border-indigo-400/80 hover:shadow-md transition-all duration-300 text-sm lg:text-base"
            >
              {t("export", { defaultValue: "Export Report" })}
            </button>
          </div>
        </main>

        {/* RIGHT: Summary - Sticky & Compact */}
        <aside className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg lg:shadow-xl border border-indigo-100/50 lg:border-indigo-200/60 sticky lg:top-32 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-visible">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h4 className="text-lg lg:text-xl font-black text-indigo-800 tracking-tight">
              {t("summary", { defaultValue: "Summary" })}
            </h4>
            <div className="text-indigo-600 font-bold text-base lg:text-lg bg-indigo-100/60 rounded-lg px-3 py-1.5 lg:px-4 lg:py-2">
              {t("points", { defaultValue: "Points" })}: <span className="text-indigo-700 font-black">{totalPoints}</span>
            </div>
          </div>
          <div className="space-y-3 lg:space-y-4">
            <SummaryCard
              title={t("npv", { defaultValue: "NPV" })}
              value={currency(active.npv || 0)}
              hint={t("netPresentValue", { defaultValue: "Net Present Value" })}
            />
            <SummaryCard
              title={t("roi", { defaultValue: "ROI" })}
              value={(active.roi || 0).toFixed(2)}
              hint={t("returnOnInvestment", { defaultValue: "Return on Investment" })}
            />
            <SummaryCard
              title={t("employmentProb", { defaultValue: "Employment" })}
              value={`${((active.employmentProb || 0) * 100).toFixed(1)}%`}
              hint={t("employmentProbability", { defaultValue: "Employment Probability" })}
            />
            <SummaryCard
              title={t("startingSalary", { defaultValue: "Salary" })}
              value={currency(active.startingSalary || 0)}
              hint={t("averageStartingSalary", { defaultValue: "Avg Starting Salary" })}
            />
            <SummaryCard
              title={t("timeToJob", { defaultValue: "Time" })}
              value={`${active.timeToJob} ${t("months", { defaultValue: "months" })}`}
              hint={t("typicalTimeToEmployment", { defaultValue: "Typical Time to Job" })}
            />
            <SummaryCard
              title={t("scholarshipOdds", { defaultValue: "Scholarship" })}
              value={`${Math.round((active.scholarshipOdds || 0) * 100)}%`}
              hint={t("scholarshipOdds", { defaultValue: "Scholarship Odds" })}
            />
          </div>
          {/* Badges */}
          <div className="mt-6 lg:mt-8">
            <h5 className="text-sm lg:text-base font-semibold mb-3 lg:mb-4 text-indigo-800">
              {t("badges", { defaultValue: "Badges" })}
            </h5>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {totalPoints >= 50 && (
                <span className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg">
                  Career Pro
                </span>
              )}
              {totalPoints >= 30 && (
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg">
                  Explorer
                </span>
              )}
              {stream === "public_service" && totalPoints >= 40 && (
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg">
                  Patriot Badge
                </span>
              )}
              {totalPoints < 10 && (
                <div className="text-indigo-500/60 italic text-xs lg:text-sm font-medium text-center w-full py-3 bg-indigo-50/60 rounded-lg">
                  {t("noBadgesYet", { defaultValue: "No badges yet - Build more!" })}
                </div>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <button className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-2.5 lg:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm lg:text-base">
              {t("share", { defaultValue: "Share" })}
            </button>
            <button className="w-full border-2 border-indigo-300/60 rounded-xl py-2.5 lg:py-3 text-indigo-700 font-semibold hover:bg-indigo-50/60 hover:border-indigo-400/80 hover:shadow-md transition-all duration-300 text-sm lg:text-base">
              {t("save", { defaultValue: "Save" })}
            </button>
          </div>
        </aside>
      </div>
    </div>

    {/* Modals & Docks */}
    <AbroadModal
      isOpen={showAbroad}
      onClose={() => setShowAbroad(false)}
      scenario={active}
    />
    <VoiceDock expanded={dockExpanded} setExpanded={setDockExpanded} />
    {showFullChart && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-black/30 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-6xl lg:max-w-7xl max-h-[95vh] relative overflow-hidden">
          <div className="h-[70vh] lg:h-[85vh] p-6 lg:p-12 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-white/80">
            <FlowChart
              active={active}
              getLabel={getLabel}
              lang={i18n.language}
              t={t}
              dynamicPerks={dynamicPerks}
              isFullScreen={true}
              onCloseFullScreen={() => setShowFullChart(false)}
            />
          </div>
          <button
            onClick={() => setShowFullChart(false)}
            className="absolute top-6 right-6 z-10 p-3 lg:p-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </div>
    )}
    {/* FAB */}
    <div className="fixed right-6 bottom-6 z-40 lg:z-50">
      <button
        onClick={() => setDockExpanded(!dockExpanded)}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl hover:shadow-2xl/50 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300"
        aria-label="Voice Assistant"
        title="Voice Assistant"
      >
        <Mic className="w-6 h-6" />
      </button>
    </div>
  </div>
);
}
