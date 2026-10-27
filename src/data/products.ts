export interface Product {
  id: string;
  name: string;
  category: 'عبايات' | 'إسدالات';
  price: number;
  tag: string;
  bestSeller: boolean;
  image: string;
  gallery: string[];
  svgVariant: 'qamar' | 'andalusian' | 'najd' | 'mirage' | 'yaqout' | 'rawda' | 'dunes' | 'cordoba';
  description: string;
  fabric: string;
  sizes: string[];
  features: string[];
  stock?: number;
}

export const products: Product[] = [
  {
    id: 'jm-01',
    name: 'عباية الدانتيل الملكية السوداء',
    category: 'عبايات',
    price: 2450,
    tag: 'حرير كريب مع دانتيل فرنسي مطرز',
    bestSeller: true,
    image: '/products/product-1.png',
    gallery: ['/products/product-1.png', '/products/product-2.png', '/products/product-3.png'],
    svgVariant: 'qamar',
    description: 'عباية ملكية فاخرة باللون الأسود الملكي مؤطرة بتطريزات دانتيل فرنسي دقيق ممتد على طول الياقة والأكمام الواسعة مع طرحة شيفون متناسقة.',
    fabric: 'حرير كريب كوري فاخر مع دانتيل كوتور مشغول يدوياً',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features: [
      'قصة انسيابية راقية تمنح القوام هيبة ووقاراً',
      'تطريز دانتيل فاخر بطول القفلة والأكمام',
      'تأتي مع طرحة ليزر فاخرة مطابقة',
      'مثالية للمناسبات الرسمية والاستقبالات الفخمة'
    ],
    stock: 10
  },
  {
    id: 'jm-02',
    name: 'عباية الهدى العاجية بالدانتيل المنسدل',
    category: 'عبايات',
    price: 2750,
    tag: 'كريب حرير بلون بيج راقٍ وفستان داخلي',
    bestSeller: true,
    image: '/products/product-2.png',
    gallery: ['/products/product-2.png', '/products/product-1.png', '/products/product-3.png'],
    svgVariant: 'andalusian',
    description: 'إطلالة عصرية أنيقة بلون البيج الدافئ مع بطانة وفستان داخلي ناعم وتطريزات دانتيل مفرغة على حواف العباية والأكمام مع حجاب مكمل.',
    fabric: 'كريب صالونا حريري مزدوج ناعم وانسيابي مع بطانة قطنية',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features: [
      'طقم متكامل مع فستان داخلي وطرحة متناسقة',
      'تطريزات دانتيل ليزر مفرغة على المعصم والياقة',
      'درجة لون نود بيج هادئة ومميزة تليق بكافة الأوقات',
      'قماش عالي الثبات ومقاوم للتجعد وسهل العناية'
    ],
    stock: 10
  },
  {
    id: 'jm-03',
    name: 'عباية السهرة الراقية بالدانتيل الفاخر',
    category: 'عبايات',
    price: 2600,
    tag: 'حرير فحمي أنيق مع أكمام دانتيل إيطالي',
    bestSeller: true,
    image: '/products/product-3.png',
    gallery: ['/products/product-3.png', '/products/product-2.png', '/products/product-1.png'],
    svgVariant: 'yaqout',
    description: 'تصميم هوت كوتور استثنائي بلون الفحم الأنيق يتميز بأكمام دانتيل إيطالي عريض يضفي فخامة متناهية مع ياقة دانتيل كلاسيكية ممتدة.',
    fabric: 'حرير كريب نخب أول مع دانتيل إيطالي شفاف عالي الجودة',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features: [
      'أكمام دانتيل عريضة مبطنة بتول ناعم مريح',
      'قصة معطفية مفتوحة تبرز جمال الفستان الداخلي',
      'خفيفة الوزن وفاخرة في الحركة',
      'تأتي مع حقيبة قماشية خاصة لحفظ العباية'
    ],
    stock: 10
  },
  {
    id: 'jm-04',
    name: 'سدال الأصالة الملكي الأسود',
    category: 'إسدالات',
    price: 1650,
    tag: 'طقم سدال صلاة واستقبال دانتيل',
    bestSeller: false,
    image: '/products/product-1.png',
    gallery: ['/products/product-1.png', '/products/product-2.png', '/products/product-3.png'],
    svgVariant: 'najd',
    description: 'سدال واستقبال راقٍ بلمسات دانتيل فاخرة على المعصم، مصمم ليمنح الراحة التامة والستر الكامل مع خامة ناعمة وباردة.',
    fabric: 'مزيج قطن مصري طويل التيلة مع حرير كريب ناعم',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    features: [
      'ستر كامل بقصة واسعة ومريحة',
      'أطراف معصم مطاطية ناعمة مع دانتيل متناسق',
      'قماش معالج لا يلتصق بالجسم',
      'سهل الارتداء وسريع الجفاف'
    ],
    stock: 10
  },
  {
    id: 'jm-05',
    name: 'سدال الصفاء العاجي بالدانتيل',
    category: 'إسدالات',
    price: 1750,
    tag: 'طقم قطعتين بيج مع طرحة متصلة',
    bestSeller: true,
    image: '/products/product-2.png',
    gallery: ['/products/product-2.png', '/products/product-3.png', '/products/product-1.png'],
    svgVariant: 'rawda',
    description: 'طقم سدال أنثوي هادئ بلون الأوف وايت والبيج الناعم مع شريط دانتيل ناعم، مثالي للصلاة واستقبال الضيوف في المناسبات.',
    fabric: 'قطن جورجيت تركي فاخر فائق النعومة',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    features: [
      'لون بيج هادئ مريح للعين',
      'طرحة عريضة مدمجة سهلة اللف',
      'خياطة يدوية دقيقة بأعلى معايير الجودة',
      'يصل في صندوق هدايا فاخر من دار جميلة'
    ],
    stock: 10
  },
  {
    id: 'jm-06',
    name: 'عباية النخبة التراثية بالدانتيل الفرنسي',
    category: 'عبايات',
    price: 2850,
    tag: 'إصدار حصري محدود ٢٠٢٦',
    bestSeller: true,
    image: '/products/product-3.png',
    gallery: ['/products/product-3.png', '/products/product-1.png', '/products/product-2.png'],
    svgVariant: 'cordoba',
    description: 'إصدار فاخر محدود يجمع بين فخامة القصة الخليجية ونعومة الدانتيل الأوروبي، مصممة خصيصاً لسيدات الذوق الرفيع.',
    fabric: '100% حرير طبيعي مبروم مع دانتيل فاخر',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    features: [
      'إصدار محدود مرقم من دار جميلة',
      'تفاصيل دانتيل مذهلة على الصدر واليدين',
      'درزات فرنسية مخفية خالية من أي شوائب',
      'توصيل سريع خاص لكافة محافظات مصر'
    ],
    stock: 10
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getBestSellers = (): Product[] => {
  return products.filter((p) => p.bestSeller);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'الكل' || !category) return products;
  if (category === 'الأكثر مبيعًا') return getBestSellers();
  return products.filter((p) => p.category === category);
};
