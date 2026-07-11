import { useState, useEffect, useMemo } from 'react';
import AdBanner from './components/AdBanner';
import {
  Dna,
  FlaskConical,
  Hammer,
  ArrowLeftRight,
  Leaf,
  Clock,
  DollarSign,
  Utensils,
  Heart,
  Calculator,
  Zap,
  Dumbbell,
  BarChart3,
  Search,
  Moon,
  Sun,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Copy,
  Check,
  Star,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from './data/categories';
import { TOOLS_LIST } from './data/tools';
import { getToolDetails } from './data/toolsEngine';
import { Tool, ToolOutput } from './types';

// Map Category ID to Arabic translated name and description
const categoryTranslations: Record<string, { name: string; description: string }> = {
  biology: {
    name: 'علم الأحياء',
    description: 'استكشف نمو الخلايا، والاحتمالات الجينية، وحركية الإنزيمات، والأنظمة البيولوجية المختلفة.'
  },
  chemistry: {
    name: 'الكيمياء',
    description: 'حل مسائل الحسابات الكيميائية، والمولارية، والرقم الهيدروجيني (pH)، وقوانين الغازات، ومعادلات التحلل وعمر النصف.'
  },
  construction: {
    name: 'البناء والإنشاءات',
    description: 'تقدير حجم الخرسانة، وأطر الجدران، وتغطية الأسقف، وألواح الجبس، وتوزيع المساحات والمسافات.'
  },
  conversion: {
    name: 'تحويل الوحدات',
    description: 'تحويل الأطوال، ودرجات الحرارة، وحجم البيانات الرقمية، والسرعة، والطاقة، ومعدل استهلاك الوقود.'
  },
  ecology: {
    name: 'علم البيئة',
    description: 'احسب البصمة الكربونية، وإنتاجية الألواح الشمسية، ومؤشرات التنوع البيولوجي، وتجميع مياه الأمطار.'
  },
  'everyday-life': {
    name: 'الحياة اليومية',
    description: 'متابعة شرب الماء، وحساب البقشيش وتوزيع الفاتورة، وجدولة ري النباتات، والعد التنازلي للمناسبات، وتخطيط النوم.'
  },
  finance: {
    name: 'المالية والاستثمار',
    description: 'صياغة وحساب الفائدة المركبة، وإطفاء القروض والتمويل، وأهداف التقاعد، وهامش تكلفة البضائع المبيعة.'
  },
  food: {
    name: 'الأغذية والطهي',
    description: 'تعديل مقادير الوصفات، وحساب نسب تحضير القهوة، وتحويل الحجوم والأوزان، وتحديد أوقات التحميص والطهي.'
  },
  health: {
    name: 'الصحة والرشاقة',
    description: 'فحص مؤشر كتلة الجسم (BMI)، ومعدل الأيض الأساسي (BMR)، والمناطق المستهدفة لمعدل ضربات القلب، ونسبة الكحول.'
  },
  math: {
    name: 'الرياضيات',
    description: 'حل المعادلات التربيعية، والكسور، ونظرية فيثاغورس، والمصفوفات، وتحويل أنظمة الأعداد.'
  },
  physics: {
    name: 'الفيزياء',
    description: 'نمذجة الحركة الكينماتيكية، وقانون أوم، والقوة الطاردة المركزية، والجاذبية، وقانون سنيل للانكسار.'
  },
  sports: {
    name: 'الرياضة والتمارين',
    description: 'متابعة سرعة الجري، ونسبة القوة إلى الوزن لراكبي الدراجات، والحد الأقصى لرفعة واحدة (1RM)، والسعرات المحروقة، ومعدل التعرق.'
  },
  statistics: {
    name: 'الإحصاء والاحتمالات',
    description: 'حساب الإحصاء الوصفي، والدرجات المعيارية (z-scores)، ومعاملات الارتباط، وحجم العينات.'
  }
};

// Map popular tool IDs to beautiful bespoke Arabic names & descriptions
const explicitTranslations: Record<string, { name: string; desc: string }> = {
  'compound-interest': {
    name: 'حاسبة الفائدة المركبة ونمو الاستثمار',
    desc: 'احسب نمو استثماراتك بمرور الوقت مع الفائدة المركبة وتأثير تكرار الفائدة اليومي أو الشهري أو السنوي.'
  },
  'bmi-whr': {
    name: 'حاسبة مؤشر كتلة الجسم ونسبة الخصر إلى الورك (BMI & WHR)',
    desc: 'قيّم وزنك وصحتك العامة بحساب مؤشر كتلة الجسم ونسبة توزيع الدهون في الجسم بدقة.'
  },
  'tip-splitter': {
    name: 'حاسبة تقسيم الفاتورة والبقشيش الفوري',
    desc: 'قسم الفاتورة وحساب البقشيش بالتساوي بين الأصدقاء بناءً على مستوى الخدمة ومبلغ الفاتورة الإجمالي.'
  },
  'concrete-yardage': {
    name: 'حاسبة كميات الخرسانة الإنشائية والصب',
    desc: 'احسب حجم الخرسانة المطلوبة لمشاريع البناء بالياردة المكعبة أو المتر المكعب مع حساب التكلفة الإجمالية.'
  },
  'dna-transcription': {
    name: 'حاسبة نسخ وترجمة الحمض النووي (DNA)',
    desc: 'تتبع عملية النسخ والترجمة للحمض النووي وتحويله إلى mRNA ومن ثم إلى سلسلة الأحماض الأمينية.'
  },
  'water-intake': {
    name: 'متابع كمية شرب الماء والترطيب اليومي',
    desc: 'احسب احتياجك اليومي المثالي من المياه بناءً على وزن الجسم، والنشاط، والمناخ المحيط.'
  },
  'countdown-timer': {
    name: 'عداد تنازلي للمناسبات والأعياد',
    desc: 'مؤقت تنازلي دقيق لحساب الأيام والساعات والدقائق المتبقية لأي حدث أو مناسبة هامة في حياتك.'
  },
  'sleep-cycles': {
    name: 'حاسبة ومخطط دورات النوم المثالية',
    desc: 'احسب أفضل وقت للنوم أو الاستيقاظ لتتوافق مع دورات النوم الطبيعية وتستيقظ بنشاط وحيوية.'
  },
  'priority-matrix': {
    name: 'مصفوفة أيزنهاور لتنظيم وإدارة المهام',
    desc: 'نظم مهامك اليومية ضمن أربعة مربعات واضحة حسب الأهمية والاستعجال لزيادة الإنتاجية.'
  },
  'carbon-footprint': {
    name: 'حاسبة البصمة الكربونية والبيئية',
    desc: 'قدّر حجم الانبعاثات الكربونية الناتجة عن أسلوب حياتك في المواصلات، والكهرباء، واستهلاك الغذاء.'
  },
  'solar-panel-yield': {
    name: 'مقدر إنتاجية الألواح الشمسية والطاقة',
    desc: 'احسب الطاقة الكهربائية المتوقعة من الألواح الشمسية بناءً على القدرة، وساعات الشمس، والكفاءة.'
  },
  'rainwater-harvest': {
    name: 'حاسبة تجميع مياه الأمطار من الأسطح',
    desc: 'احسب كمية المياه التي يمكن تجميعها من هطول الأمطار على سطح منزلك لتخزينها والاستفادة منها.'
  },
  'typing-speed': {
    name: 'مقياس واختبار سرعة الكتابة (WPM)',
    desc: 'اختبر سرعتك في الكتابة بالكلمات في الدقيقة بدقة مع حساب نسبة الخطأ والسرعة الصافية.'
  }
};

// Word mappings to translate remaining tool titles dynamically
const wordMappings: [RegExp, string][] = [
  [/Calculator/gi, 'حاسبة'],
  [/Converter/gi, 'محول'],
  [/Estimator/gi, 'مقدر'],
  [/Tracker/gi, 'متابع'],
  [/Solver/gi, 'مستكشف وحل'],
  [/Index/gi, 'مؤشر'],
  [/Rate/gi, 'معدل'],
  [/Ratio/gi, 'نسبة'],
  [/Budget/gi, 'ميزانية'],
  [/Timer/gi, 'مؤقت'],
  [/Planner/gi, 'مخطط'],
  [/System/gi, 'نظام'],
  [/Scale/gi, 'مقياس'],
  [/Zone/gi, 'نطاق'],
  [/Fractions/gi, 'كسور'],
  [/\band\b/gi, 'و'],
  [/\bwith\b/gi, 'مع'],
  [/\bfor\b/gi, 'لـ'],
  [/\bof\b/gi, 'ـ'],
  [/carbon/gi, 'الكربون'],
  [/interest/gi, 'الفائدة'],
  [/compound/gi, 'المركبة'],
  [/water/gi, 'الماء'],
  [/concrete/gi, 'الخرسانة'],
  [/energy/gi, 'الطاقة'],
  [/power/gi, 'القدرة'],
  [/speed/gi, 'السرعة'],
  [/velocity/gi, 'المتجه'],
  [/pressure/gi, 'الضغط'],
  [/temperature/gi, 'الحرارة'],
  [/cooking/gi, 'الطهي'],
  [/fuel/gi, 'الوقود'],
  [/weight/gi, 'الوزن'],
  [/height/gi, 'الطول'],
  [/length/gi, 'المسافة'],
  [/density/gi, 'الكثافة'],
  [/torque/gi, 'العزم'],
  [/time/gi, 'الوقت'],
  [/algebra/gi, 'الجبر'],
  [/math/gi, 'الرياضيات'],
  [/physics/gi, 'الفيزياء'],
  [/statistics/gi, 'الإحصاء'],
  [/sports/gi, 'الرياضة'],
  [/health/gi, 'الصحة'],
  [/finance/gi, 'المالية'],
  [/food/gi, 'الغذاء'],
  [/everyday/gi, 'الحياة اليومية'],
  [/ecology/gi, 'البيئة'],
  [/construction/gi, 'البناء'],
  [/chemistry/gi, 'الكيمياء'],
  [/biology/gi, 'الأحياء'],
  [/molecular/gi, 'الجزيئي'],
  [/genetics/gi, 'علم الوراثة'],
  [/metabolic/gi, 'الأيض'],
  [/body/gi, 'الجسم']
];

// Helper to localize names and descriptions
const getLocalizedToolInfo = (id: string, name: string, desc: string, lang: 'ar' | 'en') => {
  if (lang === 'en') return { name, desc };
  if (explicitTranslations[id]) return explicitTranslations[id];

  let translatedName = name;
  wordMappings.forEach(([regex, repl]) => {
    translatedName = translatedName.replace(regex, repl);
  });
  translatedName = translatedName.replace(/\s+/g, ' ').trim();

  let translatedDesc = desc;
  if (desc.includes('Calculate') || desc.includes('Convert') || desc.includes('Analyze') || desc.includes('Estimate')) {
    translatedDesc = `أداة ذكية مخصصة لـ ${desc.toLowerCase().replace('calculate', 'حساب').replace('convert', 'تحويل').replace('analyze', 'تحليل').replace('estimate', 'تقدير')}`;
    translatedDesc = translatedDesc
      .replace('your', 'الخاصة بك')
      .replace('based on', 'بناءً على')
      .replace('values', 'القيم')
      .replace('and', 'و');
  } else {
    translatedDesc = `حساب وتقدير مؤشرات ${translatedName} بشكل فوري ودقيق مع القوانين الرياضية الكاملة.`;
  }

  return { name: translatedName, desc: translatedDesc };
};

// Helper for dynamic keyword translation when a specific label isn't in the explicit dictionary
const translateLabelDynamically = (label: string) => {
  let tWord = label;
  const mappings: [RegExp, string][] = [
    [/Weight/gi, 'الوزن'],
    [/Height/gi, 'الطول / الارتفاع'],
    [/Width/gi, 'العرض'],
    [/Length/gi, 'المسافة / الطول'],
    [/Depth/gi, 'العمق'],
    [/Thickness/gi, 'السمك'],
    [/Value/gi, 'القيمة'],
    [/Rate/gi, 'المعدل'],
    [/Ratio/gi, 'النسبة'],
    [/Factor/gi, 'المعامل'],
    [/Score/gi, 'الدرجة'],
    [/Result/gi, 'النتيجة'],
    [/Status/gi, 'الحالة'],
    [/Target/gi, 'المستهدف'],
    [/Standard/gi, 'القياسي'],
    [/Average/gi, 'المتوسط'],
    [/Mean/gi, 'المتوسط الحسابي'],
    [/Total/gi, 'الإجمالي'],
    [/Error/gi, 'خطأ'],
    [/Success/gi, 'نجاح'],
    [/Frequencies/gi, 'التكرارات'],
    [/Frequency/gi, 'التكرار'],
    [/Probability/gi, 'الاحتمالية'],
    [/Trials/gi, 'التجارب'],
    [/Trial/gi, 'التجربة'],
    [/Option/gi, 'الخيار'],
    [/Mode/gi, 'الوضع / النموذج'],
    [/Type/gi, 'النوع'],
    [/Category/gi, 'التصنيف'],
    [/Index/gi, 'مؤشر'],
    [/Percent/gi, 'نسبة مئوية'],
    [/Percentage/gi, 'نسبة مئوية'],
    [/Amount/gi, 'المبلغ / القيمة'],
    [/Cost/gi, 'التكلفة'],
    [/Price/gi, 'السعر'],
    [/Bill/gi, 'الفاتورة'],
    [/Tip/gi, 'البقشيش'],
    [/Split/gi, 'تقسيم'],
    [/Cubic/gi, 'مكعب'],
    [/Yards/gi, 'ياردة'],
    [/Feet/gi, 'قدم'],
    [/Bags/gi, 'أكياس'],
    [/Concrete/gi, 'الخرسانة'],
    [/Required/gi, 'المطلوب'],
    [/Needed/gi, 'المطلوب'],
    [/Future/gi, 'المستقبلي'],
    [/Deposit/gi, 'الإيداع'],
    [/Interest/gi, 'الفائدة'],
    [/Compound/gi, 'المركب'],
    [/Annual/gi, 'السنوي'],
    [/Horizon/gi, 'الأفق الزمنية'],
    [/Sequence/gi, 'سلسلة'],
    [/Translation/gi, 'الترجمة'],
    [/Transcription/gi, 'النسخ'],
    [/Energy/gi, 'الطاقة'],
    [/Force/gi, 'القوة'],
    [/Primary/gi, 'الأساسي'],
    [/Secondary/gi, 'الثانوي'],
    [/Training/gi, 'التدريب'],
    [/Intensity/gi, 'الشدة'],
    [/Model/gi, 'النموذج'],
    [/Deviation/gi, 'الانحراف'],
    [/Metric/gi, 'المقياس'],
    [/Equivalent/gi, 'المعادل'],
    [/Input/gi, 'المدخل'],
    [/Output/gi, 'المخرج'],
    [/Expected/gi, 'المتوقع']
  ];
  
  mappings.forEach(([regex, replacement]) => {
    tWord = tWord.replace(regex, replacement);
  });
  return tWord;
};

// Input Parameter Label Translations
const translateInputLabel = (label: string, lang: 'ar' | 'en') => {
  if (lang === 'en') return label;
  const dict: Record<string, string> = {
    'Weight': 'الوزن',
    'Height': 'الطول / الارتفاع',
    'Interest Rate': 'معدل الفائدة السنوي',
    'Years': 'عدد السنوات',
    'Months': 'عدد الأشهر',
    'Principal': 'المبلغ الرئيسي المستثمر',
    'Value': 'القيمة',
    'Rate': 'المعدل',
    'Quantity': 'الكمية',
    'DNA Sequence': 'سلسلة الحمض النووي (DNA)',
    'DNA Sequence (5\' to 3\')': 'سلسلة الحمض النووي (من 5\' إلى 3\')',
    'Input Value': 'القيمة المدخلة',
    'Length': 'البعد / الطول',
    'Width': 'العرض',
    'Depth': 'العمق',
    'Thickness': 'السمك',
    'Primary Physics Measure': 'مقياس الفيزياء الأساسي',
    'Secondary Physics Measure': 'مقياس الفيزياء الثانوي',
    'Training Metric (e.g., Weight/Pace)': 'مقياس التدريب (مثال: الوزن/السرعة)',
    'Intensity Multiplier': 'مضاعف الشدة',
    'Event trials (n)': 'عدد تجارب الحدث (n)',
    'Single Trial Probability (p)': 'احتمالية التجربة الفردية (p)',
    'Conversion Factor Ratio': 'نسبة معامل التحويل',
    'Bill Amount': 'مبلغ الفاتورة الإجمالي',
    'Tip Percentage': 'نسبة البقشيش المرغوبة',
    'Number of People': 'عدد الأشخاص للمشاركة',
    'Service Rating': 'تقييم جودة الخدمة',
    'Waste Factor': 'نسبة الهدر المتوقعة',
    'Price per Cubic Yard': 'سعر الياردة المكعبة'
  };
  return dict[label] || translateLabelDynamically(label);
};

// Output Parameter Label Translations
const translateOutputLabel = (label: string, lang: 'ar' | 'en') => {
  if (lang === 'en') return label;
  const dict: Record<string, string> = {
    'Future Value': 'القيمة المستقبلية للاستثمار',
    'Total Interest Earned': 'إجمالي الأرباح / الفوائد المتراكمة',
    'Body Mass Index (BMI)': 'مؤشر كتلة الجسم (BMI)',
    'Waist-to-Hip Ratio (WHR)': 'نسبة الخصر إلى الورك (WHR)',
    'Health Risk Category': 'تصنيف المخاطر الصحية',
    'Body Shape Indicator': 'مؤشر شكل الجسم',
    'Tip Amount': 'مبلغ البقشيش',
    'Total Amount with Tip': 'المبلغ الإجمالي مع البقشيش',
    'Amount Per Person': 'المبلغ المستحق على الشخص الواحد',
    'Total Concrete Needed': 'إجمالي كمية الخرسانة المطلوبة',
    'Number of Bags (80lb)': 'عدد أكياس الإسمنت المطلوبة (وزن ٨٠ رطل)',
    'Estimated Material Cost': 'التكلفة التقديرية للمواد',
    'mRNA Transcript': 'نسخة الـ mRNA المقابلة',
    'Amino Acid Polypeptide': 'سلسلة الأحماض الأمينية الناتجة',
    'Translation Status': 'حالة الترجمة الجينية',
    'Vector Length (Hypotenuse)': 'طول المتجه (الوتر)',
    'Sum Total (X + Y)': 'المجموع الكلي (X + Y)',
    'Algebraic Mean': 'المتوسط الحسابي الجبري',
    'Resultant Energy/Force': 'الطاقة / القوة الناتجة',
    'Optimized Target Intensity Load': 'حمل الشدة المستهدف الأمثل',
    'Expected Success Frequency': 'تكرار النجاح المتوقع',
    'Model Standard Deviation': 'الانحراف المعياري للنموذج',
    'Equivalent Metric': 'القيمة المعادلة المقابلة'
  };
  return dict[label] || translateLabelDynamically(label);
};

// Select Option Label Translations
const translateOptionLabel = (optLabel: string, lang: 'ar' | 'en') => {
  if (lang === 'en') return optLabel;
  const dict: Record<string, string> = {
    'Excellent (20%)': 'ممتازة (٢٠٪)',
    'Good (15%)': 'جيدة (١٥٪)',
    'Fair (10%)': 'مقبولة (١٠٪)',
    'Poor (5%)': 'ضعيفة (٥٪)',
    'Standard Slab': 'بلاطة قياسية',
    'Footing': 'قاعدة أساس',
    'Column': 'عمود دائري / مربع',
    'Annually': 'سنوياً',
    'Quarterly': 'ربع سنوي',
    'Monthly': 'شهرياً',
    'Daily': 'يومياً'
  };
  return dict[optLabel] || optLabel;
};

// FAQ Translations
const translateFaq = (faq: { question: string; answer: string }, lang: 'ar' | 'en') => {
  if (lang === 'en') return faq;
  const dict: Record<string, { question: string; answer: string }> = {
    'What is transcription?': {
      question: 'ما هو نسخ الحمض النووي (Transcription)؟',
      answer: 'نسخ الحمض النووي هو العملية التي يتم من خلالها نسخ جزء من الحمض النووي الريبوزي منقوص الأكسجين (DNA) إلى حمض نووي ريبوزي رسول (mRNA) بواسطة إنزيم بلمرة الحمض النووي الريبوزي (RNA Polymerase).'
    },
    'What does the "Stop" codon mean?': {
      question: 'ماذا يعني كودون التوقف (Stop Codon)؟',
      answer: 'تشير كودونات التوقف (مثل UAA، UAG، UGA) إلى نهاية عملية الترجمة الجينية، مما يعني اكتمال تشكيل سلسلة الأحماض الأمينية للبروتين.'
    },
    'What is a healthy BMI?': {
      question: 'ما هو مؤشر كتلة الجسم الصحي؟',
      answer: 'يعتبر مؤشر كتلة الجسم بين 18.5 و 24.9 هو النطاق المثالي للبالغين من الناحية السريرية.'
    },
    'Does BMI measure muscle?': {
      question: 'هل يقيس مؤشر كتلة الجسم العضلات؟',
      answer: 'لا، يحسب مؤشر كتلة الجسم الوزن الإجمالي بالنسبة للطول، ولا يمكنه التمييز بين كتلة العضلات ونسبة الدهون في الجسم.'
    },
    'How much wastage should I account for?': {
      question: 'ما هي كمية الهدر التي يجب أن أضعها في الحسبان؟',
      answer: 'يُوصى بشدة بإضافة هامش هدر بنسبة 10% إلى الحجم النهائي للتعامل مع عدم استواء الأرض أو الانسكابات.'
    },
    'How many bags of concrete make a yard?': {
      question: 'كم عدد أكياس الخرسانة المطلوبة لصنع ياردة مكعبة؟',
      answer: 'يلزم حوالي 45 كيساً بوزن 80 رطلاً لخلط ياردة مكعبة واحدة من الخرسانة.'
    },
    'What is APY?': {
      question: 'ما هو العائد السنوي المئوي (APY)؟',
      answer: 'يعكس العائد السنوي المئوي (APY) معدل الفائدة المركب الفعلي المكتسب في عام واحد، مع أخذ تكرار المركب في الاعتبار.'
    },
    'How does frequency affect my earnings?': {
      question: 'كيف يؤثر تكرار الفائدة على أرباحي المكتسبة؟',
      answer: 'الفائدة المركبة الأكثر تكراراً (مثل اليومي مقارنة بالسنوي) تزيد من إجمالي عوائد الفائدة النهائية من خلال إعادة استثمار الأرباح المكتسبة بشكل أسرع.'
    }
  };
  if (dict[faq.question]) return dict[faq.question];

  let q = faq.question;
  let a = faq.answer;
  if (q.includes('What is the primary function of the')) {
    q = `ما هي الوظيفة الأساسية لهذه الحاسبة؟`;
    a = `توفر هذه الحاسبة تقديرات وحسابات دقيقة وفورية وتعمل بدون اتصال بالإنترنت لمساعدتك في تسيير أعمالك اليومية والدراسة في هذا المجال.`;
  } else if (q.includes('Is my calculation data saved privately?')) {
    q = 'هل بياناتي آمنة ومحفوظة بخصوصية؟';
    a = 'نعم بكل تأكيد. تتم جميع العمليات الحسابية والمعالجة الرياضية داخل متصفحك محلياً بالكامل (Client-Side)، ولا يتم إرسال أي بيانات إلى خوادم خارجية.';
  }
  return { question: q, answer: a };
};

// Map icon string to Lucide React component
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Dna': return Dna;
    case 'FlaskConical': return FlaskConical;
    case 'Hammer': return Hammer;
    case 'ArrowLeftRight': return ArrowLeftRight;
    case 'Leaf': return Leaf;
    case 'Clock': return Clock;
    case 'DollarSign': return DollarSign;
    case 'Utensils': return Utensils;
    case 'Heart': return Heart;
    case 'Calculator': return Calculator;
    case 'Zap': return Zap;
    case 'Dumbbell': return Dumbbell;
    case 'BarChart3': return BarChart3;
    default: return Calculator;
  }
};

// Map color IDs to specific Tailwind CSS styles
const colorStyles: Record<string, { bg: string; text: string; border: string; hoverBg: string; ring: string; accent: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/50', hoverBg: 'hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20', ring: 'ring-emerald-500/10', accent: 'bg-emerald-600' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800/50', hoverBg: 'hover:bg-sky-100/50 dark:hover:bg-sky-900/20', ring: 'ring-sky-500/10', accent: 'bg-sky-600' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/50', hoverBg: 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20', ring: 'ring-amber-500/10', accent: 'bg-amber-600' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800/50', hoverBg: 'hover:bg-violet-100/50 dark:hover:bg-violet-900/20', ring: 'ring-violet-500/10', accent: 'bg-violet-600' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800/50', hoverBg: 'hover:bg-green-100/50 dark:hover:bg-green-900/20', ring: 'ring-green-500/10', accent: 'bg-green-600' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/50', hoverBg: 'hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20', ring: 'ring-indigo-500/10', accent: 'bg-indigo-600' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800/50', hoverBg: 'hover:bg-teal-100/50 dark:hover:bg-teal-900/20', ring: 'ring-teal-500/10', accent: 'bg-teal-600' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800/50', hoverBg: 'hover:bg-orange-100/50 dark:hover:bg-orange-900/20', ring: 'ring-orange-500/10', accent: 'bg-orange-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800/50', hoverBg: 'hover:bg-rose-100/50 dark:hover:bg-rose-900/20', ring: 'ring-rose-500/10', accent: 'bg-rose-600' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800/50', hoverBg: 'hover:bg-cyan-100/50 dark:hover:bg-cyan-900/20', ring: 'ring-cyan-500/10', accent: 'bg-cyan-600' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800/50', hoverBg: 'hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20', ring: 'ring-yellow-500/10', accent: 'bg-yellow-600' },
  fuchsia: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', text: 'text-fuchsia-700 dark:text-fuchsia-400', border: 'border-fuchsia-200 dark:border-fuchsia-800/50', hoverBg: 'hover:bg-fuchsia-100/50 dark:hover:bg-fuchsia-900/20', ring: 'ring-fuchsia-500/10', accent: 'bg-fuchsia-600' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50', hoverBg: 'hover:bg-blue-100/50 dark:hover:bg-blue-900/20', ring: 'ring-blue-500/10', accent: 'bg-blue-600' }
};

// Helper to determine popularity ranking
const getPopularityScore = (toolId: string) => {
  const flagships: Record<string, number> = {
    'compound-interest': 100,
    'bmi-whr': 98,
    'tip-splitter': 96,
    'concrete-yardage': 94,
    'dna-transcription': 92,
    'punnett-square': 90,
    'ph-poh-solver': 88,
    'running-pace': 86,
    'descriptive-stats': 84,
    'ohms-law': 82,
    'scientific-calc': 80,
    'quadratic-equation': 78,
  };
  if (flagships[toolId] !== undefined) return flagships[toolId];
  // Deterministic fallback based on id length and characters
  let hash = 0;
  for (let i = 0; i < toolId.length; i++) {
    hash += toolId.charCodeAt(i);
  }
  return hash % 70; // All others range from 0 to 69
};

// Helper to determine recently added timestamp
const getRecentlyAddedScore = (toolId: string) => {
  // Let's make some tools "Recently Added"
  const dates: Record<string, number> = {
    'genetic-codon': new Date('2026-06-15').getTime(),
    'asphalt-driveway-tonnage': new Date('2026-07-01').getTime(),
    'bowling-handicap': new Date('2026-06-28').getTime(),
    'sweat-rate': new Date('2026-06-25').getTime(),
    'gini-lorenz': new Date('2026-06-20').getTime(),
    'snells-law': new Date('2026-06-18').getTime(),
    'insulation-r': new Date('2026-06-10').getTime(),
    'pedigree-chart': new Date('2026-06-05').getTime(),
  };
  if (dates[toolId] !== undefined) return dates[toolId];
  // Deterministic fallback (e.g. 2025 to 2026)
  let hash = 0;
  for (let i = 0; i < toolId.length; i++) {
    hash += toolId.charCodeAt(i);
  }
  const days = hash % 350;
  const msOffset = days * 24 * 60 * 60 * 1000;
  return new Date('2025-01-01').getTime() + msOffset;
};

export default function App() {
  // Theme and UI state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('omnic_dark');
    if (saved !== null) {
      return saved === 'true';
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('omnic_favs');
    return saved ? JSON.parse(saved) : ['compound-interest', 'bmi-whr', 'tip-splitter', 'concrete-yardage'];
  });
  const [sortBy, setSortBy] = useState<'popular' | 'alpha' | 'recent'>('popular');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Language state (RTL support, defaults to Arabic 'ar')
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('omnic_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // Visual success indicator for calculation button
  const [justCalculated, setJustCalculated] = useState<boolean>(false);

  // Active Tool state
  const [inputsState, setInputsState] = useState<Record<string, any>>({});
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [copiedOutputs, setCopiedOutputs] = useState<boolean>(false);
  const [showSchema, setShowSchema] = useState<boolean>(false);

  // Sync favorites with local storage
  useEffect(() => {
    localStorage.setItem('omnic_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Sync language selection with local storage
  useEffect(() => {
    localStorage.setItem('omnic_lang', lang);
  }, [lang]);

  // Sync dark mode setting with local storage and DOM class list
  useEffect(() => {
    localStorage.setItem('omnic_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute tool list filtered by search query, category, and sorted by user preference
  const filteredTools = useMemo(() => {
    const matched = TOOLS_LIST.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tool.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    // Sort matching results
    return matched.sort((a, b) => {
      if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'recent') {
        return getRecentlyAddedScore(b.id) - getRecentlyAddedScore(a.id);
      } else {
        // Default: popular
        return getPopularityScore(b.id) - getPopularityScore(a.id);
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Group the matching tools by category
  const groupedToolsByCategory = useMemo(() => {
    const groups: Record<string, Tool[]> = {};
    CATEGORIES.forEach(cat => {
      groups[cat.id] = [];
    });
    
    filteredTools.forEach(tool => {
      if (groups[tool.category]) {
        groups[tool.category].push(tool);
      }
    });

    return CATEGORIES.map(cat => ({
      ...cat,
      tools: groups[cat.id] || []
    })).filter(cat => {
      // If searching, only display categories that have matching tools
      if (searchQuery) {
        return cat.tools.length > 0;
      }
      // If a category filter is selected, only show that category
      if (selectedCategory) {
        return cat.id === selectedCategory;
      }
      return true;
    });
  }, [filteredTools, searchQuery, selectedCategory]);

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchQuery) {
      const expanded: Record<string, boolean> = {};
      groupedToolsByCategory.forEach(cat => {
        if (cat.tools.length > 0) {
          expanded[cat.id] = true;
        }
      });
      setExpandedCategories(expanded);
    }
  }, [searchQuery, groupedToolsByCategory]);

  // Instantiate active tool with dynamic engine
  const activeTool = useMemo(() => {
    if (!selectedToolId) return null;
    const baseInfo = TOOLS_LIST.find(t => t.id === selectedToolId);
    if (!baseInfo) return null;
    return getToolDetails(baseInfo.id, baseInfo.name, baseInfo.category, baseInfo.desc);
  }, [selectedToolId]);

  // Render dynamic JSON-LD Schema.org block
  const schemaMarkup = useMemo(() => {
    if (!activeTool) return null;
    const faqQuestions = activeTool.faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }));

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `https://omnicompiler.local/tools/${activeTool.category}/${activeTool.id}.html`,
          'name': activeTool.name,
          'url': `https://omnicompiler.local/tools/${activeTool.category}/${activeTool.id}.html`,
          'description': activeTool.description,
          'applicationCategory': 'EducationalApplication',
          'operatingSystem': 'Any',
          'browserRequirements': 'Requires HTML5, CSS3, and JavaScript support.'
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqQuestions
        }
      ]
    };
  }, [activeTool]);

  // Inject and sync JSON-LD Schema.org metadata into Document Head dynamically for Search Crawlers
  useEffect(() => {
    if (!schemaMarkup) {
      const existing = document.getElementById('omnic-jsonld-schema');
      if (existing) existing.remove();
      return;
    }

    let script = document.getElementById('omnic-jsonld-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'omnic-jsonld-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaMarkup);

    return () => {
      const existing = document.getElementById('omnic-jsonld-schema');
      if (existing) existing.remove();
    };
  }, [schemaMarkup]);

  // State for calculated outputs, triggered manually via Calculate button
  const [calculatedOutputs, setCalculatedOutputs] = useState<ToolOutput[]>([]);

  // Populate default inputs when a tool is opened
  useEffect(() => {
    if (activeTool) {
      const defaults: Record<string, any> = {};
      activeTool.inputs.forEach(input => {
        defaults[input.name] = input.defaultValue;
      });
      setInputsState(defaults);

      // Perform initial calculation on load
      if (activeTool.calculate) {
        try {
          const initialResult = activeTool.calculate(defaults);
          setCalculatedOutputs(initialResult);
        } catch (e) {
          console.error(e);
          setCalculatedOutputs([{ name: 'error', label: 'Status', value: 'Error in calculation.' }]);
        }
      }

      setExpandedFaqIndex(null);
      setCopiedOutputs(false);
      setShowSchema(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTool]);

  // Auto-recalculate whenever inputsState changes to ensure outputs are NEVER empty or stale
  useEffect(() => {
    if (activeTool && activeTool.calculate && Object.keys(inputsState).length > 0) {
      try {
        const result = activeTool.calculate(inputsState);
        setCalculatedOutputs(result);
      } catch (e) {
        console.error('Calculation error:', e);
      }
    }
  }, [inputsState, activeTool]);

  // Handle manual calculation trigger with aesthetic micro-interaction feedback
  const handleCalculate = () => {
    if (!activeTool || !activeTool.calculate) return;
    try {
      const result = activeTool.calculate(inputsState);
      setCalculatedOutputs(result);
      setJustCalculated(true);
      setTimeout(() => setJustCalculated(false), 1500);
    } catch (e) {
      console.error(e);
      setCalculatedOutputs([{ name: 'error', label: 'Status', value: 'Error in calculation. Check your inputs.' }]);
    }
  };

  // Get active category styling
  const activeCategoryStyle = useMemo(() => {
    if (!activeTool) return colorStyles.sky;
    const cat = CATEGORIES.find(c => c.id === activeTool.category);
    return colorStyles[cat?.color || 'sky'];
  }, [activeTool]);

  // Toggle Category expansion handler
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand All categories handler
  const handleExpandAll = () => {
    const next: Record<string, boolean> = {};
    CATEGORIES.forEach(cat => {
      next[cat.id] = true;
    });
    setExpandedCategories(next);
  };

  // Collapse All categories handler
  const handleCollapseAll = () => {
    setExpandedCategories({});
  };

  // Toggle Favorite handler
  const toggleFavorite = (id: string, e: any) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Copy outputs helper
  const copyOutputsToClipboard = () => {
    if (!calculatedOutputs.length) return;
    const textToCopy = calculatedOutputs
      .map(o => `${o.label}: ${o.value} ${o.unit || ''}`)
      .join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedOutputs(true);
      setTimeout(() => setCopiedOutputs(false), 2000);
    });
  };

  // Copy page URL helper (mock SEO share)
  const copyShareUrl = () => {
    const url = `${window.location.origin}/tools/${activeTool?.category}/${activeTool?.id}.html`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Translation dictionary mapping standard labels to active language (Arabic / English)
  const t = {
    appName: lang === 'ar' ? 'منصة الحاسبات الذكية' : 'Web Calculators',
    toolsCount: lang === 'ar' ? '٢٠٠ أداة وحاسبة شاملة' : '200 COMPREHENSIVE TOOLS',
    searchPlaceholder: lang === 'ar' ? 'ابحث في ٢٠٠ حاسبة... (مثال: الفائدة المركبة، الـ DNA، مؤشر كتلة الجسم، الخرسانة، سرعة الجري)' : 'Search 200 calculators... (e.g. compound interest, DNA, pH, concrete, pace)',
    clear: lang === 'ar' ? 'مسح' : 'CLEAR',
    foundMatches: lang === 'ar' ? `تم العثور على ${filteredTools.length} حاسبة مطابقة` : `Found ${filteredTools.length} matching tools`,
    clearCategoryFilter: lang === 'ar' ? 'إزالة تصفية الأقسام' : 'Clear active category filter',
    bookmarkedTitle: lang === 'ar' ? 'الحاسبات المحفوظة والمفضلة' : 'Your Bookmarked Tools',
    directoryTitle: lang === 'ar' ? 'دليل الأقسام والحاسبات التفاعلية / Interactive Directory' : 'Interactive Calculators Directory',
    directorySubtitle: lang === 'ar' ? 'اضغط على أي قسم لعرض الحاسبات التابعة له وتصفح الأدوات الذكية' : 'Click any category row to view its calculators and explore the intelligent tools',
    expandAll: lang === 'ar' ? '👐 توسيع الكل' : '👐 Expand All',
    collapseAll: lang === 'ar' ? '📁 طي الكل' : '📁 Collapse All',
    sortBy: lang === 'ar' ? 'ترتيب حسب:' : 'Sort By:',
    mostPopular: lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular',
    alphabetical: lang === 'ar' ? 'أبجدياً (A-Z)' : 'Alphabetical (A-Z)',
    recentlyAdded: lang === 'ar' ? 'أضيف حديثاً' : 'Recently Added',
    matchedResults: lang === 'ar' ? `النتائج المطابقة (${filteredTools.length})` : `Matched Results (${filteredTools.length})`,
    matchedText: lang === 'ar' ? 'الأقسام التي تحتوي على نتائج مطابقة تم توسيعها تلقائياً' : 'Categories containing matches are automatically expanded',
    backToHome: lang === 'ar' ? 'الرجوع للمنصة الرئيسية / Back to Home' : 'Back to Home',
    formulaTitle: lang === 'ar' ? 'المنهجية الرياضية والقانون المستخدم' : 'Mathematical Formula & Underlying Logic',
    algorithmInUse: lang === 'ar' ? 'الخوارزمية وطريقة الحساب المستخدمة' : 'ALGORITHM IN USE',
    howToInterpret: lang === 'ar' ? 'كيفية قراءة وفهم النتائج:' : 'How to interpret results:',
    fieldApplication: lang === 'ar' ? 'التطبيق العملي والمهني في الميدان:' : 'Professional Field Application:',
    precisionNote: lang === 'ar' ? 'تعتمد المنصة الحسابات الرياضية العالية الدقة (Double Precision Float) محلياً لضمان تجنب أخطاء التقريب الرقمي، مما يتوافق مع المعايير العلمية والمالية الدولية.' : 'Our platform compiles formulas client-side with Double Precision Float representations to avoid computational truncation. Calculations align with international scientific and financial publishing bodies, rendering high fidelity estimates perfect for field diagnostics, architectural estimators, or study guides.',
    calculatedSolutions: lang === 'ar' ? 'النتائج والحلول الرياضية' : 'Calculated Solutions',
    liveBadge: lang === 'ar' ? 'مباشر' : 'LIVE',
    calculateBtn: lang === 'ar' ? 'احسب الآن' : 'Calculate',
    calculatedSuccessfully: lang === 'ar' ? '✓ تم الحساب بنجاح' : '✓ Calculated Successfully',
    resetBtn: lang === 'ar' ? 'إعادة تعيين القيم' : 'Reset / Update',
    instructionsText: lang === 'ar' ? 'قم بتعديل قيم المدخلات أعلاه ثم اضغط على زر الحساب لتحديث الحلول الرياضية فورا.' : 'Modify the input parameters above, then click the Calculate button to update results.',
    faqTitle: lang === 'ar' ? 'الأسئلة الشائعة حول الأداة' : 'Frequently Asked Questions',
    faqQ1: lang === 'ar' ? 'ما هي الوظيفة الأساسية لهذه الحاسبة؟' : 'What is the primary function of this tool?',
    faqA1Fallback: lang === 'ar' ? 'توفر هذه الحاسبة تقديرات وحسابات دقيقة وفورية وتعمل بدون اتصال بالإنترنت لمساعدتك في تسيير أعمالك اليومية والدراسة في هذا المجال.' : 'It provides precise, quick, and offline-capable estimations of target metrics in this discipline, helping students and professionals save time.',
    faqQ2: lang === 'ar' ? 'هل بياناتي آمنة ومحفوظة بخصوصية؟' : 'Is my calculation data saved privately?',
    faqA2: lang === 'ar' ? 'نعم بكل تأكيد. تتم جميع العمليات الحسابية والمعالجة الرياضية داخل متصفحك محلياً بالكامل (Client-Side)، ولا يتم إرسال أي بيانات إلى أي خوادم خارجية.' : 'Yes. All computations are executed purely client-side inside your browser, meaning your data never leaves your device.',
    technicalSeo: lang === 'ar' ? 'كود تحسين محركات البحث التقني (JSON-LD)' : 'Technical SEO Schema (JSON-LD)',
    schemaDesc: lang === 'ar' ? 'يتم حقن كود الميتا داتا المنظم (Structured Data) تلقائياً في رأس الصفحة لمساعدة عناكب البحث مثل Googlebot على فهرسة الحاسبة كأداة برمجية تفاعلية.' : 'This structured JSON-LD data is dynamically injected into the head markup for crawlers like Googlebot to index WebApplication and FAQPage formats cleanly, maximizing SERP features.',
    relatedTitle: lang === 'ar' ? 'حاسبات وأدوات أخرى ذات صلة' : 'Related Calculators',
    relatedToolBadge: lang === 'ar' ? 'حاسبة ذات صلة' : 'RELATED TOOL',
    footerCoda: lang === 'ar' ? '© ٢٠٢٦ منصة الحاسبات الرقمية الشاملة. تصميم وبرمجة وحسابات أصلية ومجانية بالكامل.' : '© 2026 Web Calculators Suite. Built purely client-side with original copy, design, and calculations.',
    footerHomeHub: lang === 'ar' ? 'الرئيسية' : 'Home Hub',
    footerSecured: lang === 'ar' ? 'جميع الحاسبات الـ ٢٠٠ تعمل محلياً بخصوصية كاملة' : 'ALL 200 SOLVERS SECURED CLIENT-SIDE',
    howToUseTitle: lang === 'ar' ? 'دليل الاستخدام والتشغيل' : 'How to Use',
    outputsTitle: lang === 'ar' ? 'النتائج الرياضية' : 'Outputs',
    bookmarkText: lang === 'ar' ? 'حفظ الحاسبة' : 'Add Bookmark',
    bookmarkedText: lang === 'ar' ? 'محفوظة' : 'Bookmarked',
    shareText: lang === 'ar' ? 'نسخ رابط المشاركة' : 'Share Tool URL',
    copiedLinkText: lang === 'ar' ? 'تم نسخ الرابط الفريد!' : 'Copied Static link!',
    parametersConfigurator: lang === 'ar' ? 'إعداد تهيئة المتغيرات والمدخلات' : 'Parameters Configurator',
    noResults: lang === 'ar' ? 'لم يتم العثور على أي حاسبة تطابق هذا البحث. جرب كتابة كلمات أخرى.' : 'No calculators matched your search query. Try typing another term.',
    backToPortal: lang === 'ar' ? 'العودة لبوابة الحاسبات الذكية' : 'Back to Web Tools Portal',
    popularBadge: lang === 'ar' ? 'رائجة 🔥' : 'Popular 🔥',
    newBadge: lang === 'ar' ? 'جديد ✨' : 'New ✨',
    openSolver: lang === 'ar' ? 'فتح الحاسبة' : 'Open Solver',
    tools: lang === 'ar' ? 'الأدوات' : 'Tools'
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => { setSelectedToolId(null); setSelectedCategory(null); setSearchQuery(''); }}
            className={`flex items-center gap-2 group text-left ${lang === 'ar' ? 'text-right' : 'text-left'}`}
            id="btn-logo"
          >
            <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white shadow-sm transition-transform group-hover:scale-105">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                {t.appName}
              </h1>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {t.toolsCount}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Language Switcher button */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 dark:text-indigo-400 transition-all border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-1.5 cursor-pointer"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
              id="lang-toggle"
            >
              <span>🌐</span>
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dark Mode toggle button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
              title="Toggle Dark Mode"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER STAGE */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedToolId ? (
            /* ==============================================================
               HOMEPAGE VIEW: Categories, search query filters, 200 tools grid
               ============================================================== */
            <motion.div
              key="homepage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* JUMBOTRON HERO */}
              <div className="text-center max-w-2xl mx-auto mb-10">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-medium font-mono mb-4 border border-indigo-200/50 dark:border-indigo-900/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Client-Side & SEO Optimized</span>
                </motion.div>
                <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {lang === 'ar' ? 'منصة الحاسبات والأدوات الشاملة' : 'Free Web Calculators'}
                </h2>
                <AdBanner adKey="877e7e4ff13f148d2f72292289d0db19" />
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {lang === 'ar' 
                    ? 'ابحث وتهيّأ وحل أكثر من ٢٠٠ حاسبة عالية المنفعة الفورية عبر ١٣ قسماً تخصصياً. القوانين والمعادلات الرياضية كاملة، وميتا داتا JSON-LD مدمجة في كل لوحة لتسريع الأرشفة الحية.'
                    : 'Search, configure, and instantly solve 200 high-utility calculators across 13 core disciplines. Complete formulas, word counts, and structured JSON Schema embedded in every calculation sheet.'}
                </p>
              </div>

              {/* SEARCH HUB PANEL */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="relative group">
                  <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-indigo-500 ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none font-sans text-slate-900 dark:text-white transition-all text-sm ${lang === 'ar' ? 'pr-12 pl-24' : 'pl-12 pr-24'}`}
                    id="search-bar"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-500 rounded cursor-pointer ${lang === 'ar' ? 'left-4' : 'right-4'}`}
                    >
                      {t.clear}
                    </button>
                  )}
                </div>

                {/* Live Count Status Indicator */}
                <div className="flex items-center justify-between mt-3 px-2 text-xs font-mono text-slate-500">
                  <span>{t.foundMatches}</span>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {t.clearCategoryFilter}
                    </button>
                  )}
                </div>
              </div>

              {/* QUICK CHIPS FAVORITES ROW */}
              {favorites.length > 0 && !searchQuery && !selectedCategory && (
                <div className="mb-10">
                  <h3 className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                    {t.bookmarkedTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {favorites.map(favId => {
                      const favTool = TOOLS_LIST.find(x => x.id === favId);
                      if (!favTool) return null;
                      const cat = CATEGORIES.find(c => c.id === favTool.category);
                      const style = colorStyles[cat?.color || 'sky'];
                      const localizedInfo = getLocalizedToolInfo(favTool.id, favTool.name, favTool.desc, lang);
                      return (
                        <div
                          key={favTool.id}
                          onClick={() => setSelectedToolId(favTool.id)}
                          className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
                              {(() => {
                                const Icon = getCategoryIcon(cat?.iconName || 'Calculator');
                                return <Icon className="w-4 h-4" />;
                              })()}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-display font-medium text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {localizedInfo.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate font-mono">
                                {lang === 'ar' ? categoryTranslations[cat?.id || '']?.name : cat?.name}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(favTool.id, e)}
                            className="p-1 rounded-md text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                            title="Remove bookmark"
                          >
                            <Star className="w-4 h-4 fill-amber-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CATEGORIES AS LISTS SECTION (ACCORDION DIRECTORY) */}
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/40">
                  <div>
                    <h3 className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {searchQuery ? t.matchedResults : t.directoryTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {searchQuery ? t.matchedText : t.directorySubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* EXPAND/COLLAPSE ALL CONTROL BUTTONS */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                      <button
                        onClick={handleExpandAll}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium font-sans text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all cursor-pointer"
                        title="Expand all categories"
                      >
                        {t.expandAll}
                      </button>
                      <button
                        onClick={handleCollapseAll}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium font-sans text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all cursor-pointer"
                        title="Collapse all categories"
                      >
                        {t.collapseAll}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {t.sortBy}
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                        id="sort-dropdown"
                      >
                        <option value="popular">{t.mostPopular}</option>
                        <option value="alpha">{t.alphabetical}</option>
                        <option value="recent">{t.recentlyAdded}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {groupedToolsByCategory.map((category) => {
                    const style = colorStyles[category.color] || colorStyles.sky;
                    const Icon = getCategoryIcon(category.iconName);
                    const isExpanded = !!expandedCategories[category.id];

                    return (
                      <div
                        key={category.id}
                        className="border border-slate-200 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden transition-all duration-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-800"
                      >
                        {/* CATEGORY ROW HEADER */}
                        <div
                          onClick={() => toggleCategory(category.id)}
                          className={`p-5 flex items-center justify-between cursor-pointer transition-colors select-none ${
                            isExpanded 
                              ? 'bg-slate-50/50 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-800/40' 
                              : 'hover:bg-slate-50/40 dark:hover:bg-slate-900/5'
                          }`}
                          id={`cat-list-row-${category.id}`}
                        >
                          <div className="flex items-center gap-4 min-w-0 pr-4">
                            {/* Icon */}
                            <div className={`p-3 rounded-xl shrink-0 ${style.bg} ${style.text}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-display font-semibold text-sm md:text-base text-slate-900 dark:text-white leading-tight">
                                  {lang === 'ar' ? categoryTranslations[category.id]?.name : category.name}
                                </h4>
                                {searchQuery && (
                                  <span className="text-[10px] font-mono font-medium text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full shrink-0">
                                    {category.tools.length} {lang === 'ar' ? 'مطابقة' : 'matched'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed md:line-clamp-2">
                                {lang === 'ar' ? categoryTranslations[category.id]?.description : category.description}
                              </p>
                            </div>
                          </div>

                          {/* Action badge and Rotating chevron */}
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40">
                              {lang === 'ar' ? `${category.toolsCount} حاسبة` : `${category.toolsCount} TOOLS`}
                            </span>
                            <div className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-250 ${isExpanded ? 'rotate-180 text-indigo-500 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : 'bg-slate-100/50 dark:bg-slate-900/50'}`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* EXPANDED PANEL OF CALCULATORS */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 bg-slate-50/20 dark:bg-slate-900/5 border-t border-slate-100/50 dark:border-slate-800/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {category.tools.map((tool, idx) => {
                                    const isFavorite = favorites.includes(tool.id);
                                    const localizedInfo = getLocalizedToolInfo(tool.id, tool.name, tool.desc, lang);

                                    return (
                                      <motion.div
                                        layout
                                        key={tool.id}
                                        initial={{ opacity: 0, scale: 0.98, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.15, delay: Math.min(idx * 0.01, 0.15) }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedToolId(tool.id);
                                        }}
                                        className="group p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                                        id={`tool-card-${tool.id}`}
                                      >
                                        <div>
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate">
                                                {lang === 'ar' ? categoryTranslations[category.id]?.name : category.name}
                                              </span>
                                              {getPopularityScore(tool.id) >= 78 && (
                                                <span className="text-[9px] font-mono font-medium text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0" title="High Popularity Tool">
                                                  <span>🔥</span>
                                                  <span>{lang === 'ar' ? 'رائجة' : 'Popular'}</span>
                                                </span>
                                              )}
                                              {getRecentlyAddedScore(tool.id) >= new Date('2026-06-01').getTime() && (
                                                <span className="text-[9px] font-mono font-medium text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0" title="Recently Added Tool">
                                                  <span>✨</span>
                                                  <span>{lang === 'ar' ? 'جديد' : 'New'}</span>
                                                </span>
                                              )}
                                            </div>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(tool.id, e);
                                              }}
                                              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-700 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shrink-0 cursor-pointer"
                                              title="Add bookmark"
                                            >
                                              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                                            </button>
                                          </div>
                                          <h4 className="font-display font-semibold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug transition-colors">
                                            {localizedInfo.name}
                                          </h4>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                                            {localizedInfo.desc}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                                          <span>{t.openSolver}</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {groupedToolsByCategory.length === 0 && (
                  <div className="text-center py-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      No calculators matched your search query. Try typing another term.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ==============================================================
               DETAILED INTERACTIVE VIEW: Selected Tool Workspace Sheet
               ============================================================== */
            activeTool && (
              <motion.div
                key="activesheet"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* BACKLINK NAVIGATION COLUMN */}
                <div className="lg:col-span-12">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
                    <button
                      onClick={() => setSelectedToolId(null)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      id="btn-back"
                    >
                      <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      <span>{t.backToPortal}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(activeTool.id, e)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          favorites.includes(activeTool.id)
                            ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${favorites.includes(activeTool.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{favorites.includes(activeTool.id) ? t.bookmarkedText : t.bookmarkText}</span>
                      </button>

                      <button
                        onClick={copyShareUrl}
                        className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copySuccess ? t.copiedLinkText : t.shareText}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* BREADCRUMB & INTRO JUMBOTRON */}
                <div className="lg:col-span-12">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                    <span>{t.tools}</span>
                    <span>/</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {lang === 'ar' ? categoryTranslations[activeTool.category]?.name : CATEGORIES.find(c => c.id === activeTool.category)?.name}
                    </span>
                    <span>/</span>
                    <span className="text-slate-500">{activeTool.id}</span>
                  </div>
                  <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
                    {getLocalizedToolInfo(activeTool.id, activeTool.name, activeTool.description, lang).name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed text-sm max-w-4xl">
                    {getLocalizedToolInfo(activeTool.id, activeTool.name, activeTool.description, lang).desc}
                  </p>
                </div>

                {/* LEFT WORKSPACE CARD: Dynamic inputs form interface */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-4">
                      <span>{t.parametersConfigurator}</span>
                    </h3>

                    <div className="space-y-5">
                      {activeTool.inputs.map(input => (
                        <div key={input.name} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {translateInputLabel(input.label, lang)}
                            </label>
                            {input.unit && (
                              <span className="text-[10px] font-mono font-medium text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
                                {input.unit}
                              </span>
                            )}
                          </div>

                          {input.type === 'select' ? (
                            <select
                              value={inputsState[input.name] ?? ''}
                              onChange={(e) => setInputsState(prev => ({ ...prev, [input.name]: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                              {input.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {translateOptionLabel(opt.label, lang)}
                                </option>
                              ))}
                            </select>
                          ) : input.type === 'text' ? (
                            <input
                              type="text"
                              value={inputsState[input.name] ?? ''}
                              placeholder={lang === 'ar' ? 'أدخل النص الجيني هنا...' : input.placeholder}
                              onChange={(e) => setInputsState(prev => ({ ...prev, [input.name]: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          ) : (
                            <div className="space-y-2">
                              <input
                                type="number"
                                value={inputsState[input.name] ?? ''}
                                min={input.min}
                                max={input.max}
                                step={input.step}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? '' : Number(e.target.value);
                                  setInputsState(prev => ({ ...prev, [input.name]: val }));
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              />
                              {(input.min !== undefined && input.max !== undefined) && (
                                <input
                                  type="range"
                                  min={input.min}
                                  max={input.max}
                                  step={input.step ?? 1}
                                  value={Number(inputsState[input.name] ?? input.defaultValue)}
                                  onChange={(e) => setInputsState(prev => ({ ...prev, [input.name]: Number(e.target.value) }))}
                                  className="w-full accent-indigo-600 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* MANUAL CALCULATION BUTTON */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                        {t.instructionsText}
                      </p>
                      <button
                        onClick={handleCalculate}
                        className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                        id="btn-calculate"
                      >
                        <Calculator className="w-4.5 h-4.5" />
                        <span>{justCalculated ? t.calculatedSuccessfully : t.calculateBtn}</span>
                      </button>
                      {/* 🌟 كود إعلان Adsterra المباشر 🌟 */}
<div className="mt-6 flex justify-center w-full min-h-[90px]">
  <iframe 
    src="//www.highperformanceformat.com/watchnew?key=877e7e4ff13f148d2f72292289d0db19" 
    width="728" 
    height="90" 
    frameBorder="0" 
    scrolling="no"
    className="rounded-lg shadow-sm max-w-full"
  ></iframe>
</div>


                    </div>
                  </div>

                  {/* MATHEMATICAL METHODOLOGY EXPLANATION COPY (300-400 Words, SEO focused) */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>{t.formulaTitle}</span>
                    </h3>
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 font-sans">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
                        <p className="font-sans font-semibold text-[10px] text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1.5">
                          {t.algorithmInUse}
                        </p>
                        {activeTool.formula}
                      </div>

                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs pt-2">
                        {t.howToInterpret}
                      </h4>
                      <p>
                        {lang === 'ar'
                          ? 'توضح النتائج المخرجة القيم الدقيقة الناتجة من معادلتنا الرياضية المبرهنة لضمان الموثوقية التامة في هذا المجال التخصصي.'
                          : activeTool.howToUse}
                      </p>

                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs pt-2">
                        {t.fieldApplication}
                      </h4>
                      <p>
                        {lang === 'ar'
                          ? 'تُستخدم هذه الحاسبة كأداة تشخيصية وبحثية معتمدة علمياً، وتعمل بكفاءة تامة بدون إنترنت لضمان تسهيل اتخاذ القرارات وحساب المعايير بكفاءة مطلقة.'
                          : activeTool.longDescription}
                      </p>

                      <p>
                        {t.precisionNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT WORKSPACE CARD: Calculation Live Output & Tools panel */}
                <div className="lg:col-span-5 space-y-6">
                  <div className={`border rounded-2xl p-6 shadow-sm overflow-hidden relative flex flex-col justify-between ${activeCategoryStyle.bg} ${activeCategoryStyle.border}`}>
                    <div>
                      <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base mb-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/40 pb-4">
                        <span>{t.calculatedSolutions}</span>
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                          {t.liveBadge}
                        </span>
                      </h3>

                      <div className="space-y-4">
                        {calculatedOutputs.map(output => (
                          <div key={output.name} className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/60 p-4 rounded-xl flex items-center justify-between relative group">
                            <div className="overflow-hidden">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono block">
                                {translateOutputLabel(output.label, lang)}
                              </span>
                              <div className="flex items-baseline gap-1 mt-1 overflow-hidden">
                                <span className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">
                                  {output.value}
                                </span>
                                {output.unit && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {output.unit}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Status Indicator Badge */}
                            {output.badge && (
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${output.badgeColor || 'text-slate-600 bg-slate-100'}`}>
                                {lang === 'ar' 
                                  ? (output.badge === 'Low Risk' ? 'قليل المخاطر' : output.badge === 'Moderate Risk' ? 'متوسط المخاطر' : output.badge === 'High Risk' ? 'مرتفع المخاطر' : output.badge)
                                  : output.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between gap-4">
                      <button
                        onClick={copyOutputsToClipboard}
                        className="w-full py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {copiedOutputs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedOutputs ? (lang === 'ar' ? 'تم نسخ المخرجات!' : 'Copied Results!') : (lang === 'ar' ? 'نسخ النتائج' : 'Copy Outputs')}</span>
                      </button>

                      <button
                        onClick={() => {
                          const defaults: Record<string, any> = {};
                          activeTool.inputs.forEach(i => { defaults[i.name] = i.defaultValue; });
                          setInputsState(defaults);
                          if (activeTool.calculate) {
                            try {
                              const initialResult = activeTool.calculate(defaults);
                              setCalculatedOutputs(initialResult);
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                        className="p-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap"
                        title="Reset inputs to defaults"
                      >
                        {t.resetBtn}
                      </button>
                    </div>
                  </div>

                  {/* FAQ ACCORDION SECTION */}
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
                      <HelpCircle className="w-4 h-4 text-indigo-500" />
                      <span>{t.faqTitle}</span>
                    </h3>

                    <div className="space-y-3">
                      {activeTool.faqs.map((faq, index) => {
                        const isExpanded = expandedFaqIndex === index;
                        const localizedFaq = translateFaq(faq, lang);
                        return (
                          <div
                            key={index}
                            className="border border-slate-100 dark:border-slate-800/60 rounded-xl overflow-hidden transition-all"
                          >
                            <button
                              onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                              className={`w-full px-4 py-3 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                            >
                              <span>{localizedFaq.question}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 py-3.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950">
                                    {localizedFaq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* BOTTOM COMPONENT: Internal linking / Related tools in same category */}
                <div className="lg:col-span-12 mt-6">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                    {lang === 'ar'
                      ? `حاسبات وأدوات أخرى ذات صلة بـ ${categoryTranslations[activeTool.category]?.name}`
                      : `Related ${CATEGORIES.find(c => c.id === activeTool.category)?.name} Calculators`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TOOLS_LIST.filter(t => t.category === activeTool.category && t.id !== activeTool.id)
                      .slice(0, 4)
                      .map(tool => {
                        const localizedTool = getLocalizedToolInfo(tool.id, tool.name, tool.desc, lang);
                        return (
                          <div
                            key={tool.id}
                            onClick={() => setSelectedToolId(tool.id)}
                            className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-sm transition-all group text-left"
                          >
                            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
                              {t.relatedToolBadge}
                            </span>
                            <h4 className="font-display font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 leading-tight">
                              {localizedTool.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-normal">
                              {localizedTool.desc}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER CODA */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>{t.footerCoda}</p>
          <div className="flex items-center justify-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => { setSelectedToolId(null); setSelectedCategory(null); setSearchQuery(''); }}
              className="hover:underline cursor-pointer"
            >
              {t.footerHomeHub}
            </button>
            <span>•</span>
            <span className="font-mono text-[10px]">{t.footerSecured}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
