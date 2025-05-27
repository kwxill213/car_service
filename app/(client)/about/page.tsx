import { CheckCircle, Users, Award, Clock } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { value: "13+", label: "Лет опыта", icon: <Clock className="h-8 w-8" /> },
    { value: "5000+", label: "Довольных клиентов", icon: <Users className="h-8 w-8" /> },
    { value: "25+", label: "Сертификатов", icon: <Award className="h-8 w-8" /> },
    { value: "100%", label: "Гарантия качества", icon: <CheckCircle className="h-8 w-8" /> },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">О нашем автосервисе</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alan SS - это современный автосервис с многолетним опытом работы и командой профессионалов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Наша история</h2>
            <p className="text-gray-700 mb-4">
              Автосервис Alan SS был основан в 2010 году с целью предоставления качественных услуг по ремонту и обслуживанию автомобилей.
            </p>
            <p className="text-gray-700 mb-4">
              Начиная с небольшой мастерской, мы выросли в современный сервисный центр, оснащенный самым современным оборудованием.
            </p>
            <p className="text-gray-700">
              Наша команда состоит из сертифицированных специалистов, регулярно проходящих обучение у производителей автомобилей.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-6">Наши принципы</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Честность и прозрачность в работе</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Использование качественных материалов</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Индивидуальный подход к каждому клиенту</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Гарантия на все виды работ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Мы в цифрах</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Наша команда</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto mb-8">
            Наши специалисты - это профессионалы с многолетним опытом работы, регулярно повышающие свою квалификацию.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="/ivan.avif" alt="Иван Петров" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Иван Петров</h3>
              <p className="text-blue-600 mb-3">Главный механик</p>
              <p className="text-gray-600">Опыт работы 15 лет. Специализация - двигатели и трансмиссии.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="/alexey.jpg" alt="Алексей Смирнов" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Алексей Смирнов</h3>
              <p className="text-blue-600 mb-3">Автоэлектрик</p>
              <p className="text-gray-600">Опыт работы 10 лет. Специализация - электронные системы.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="/dmitry.jpg" alt="Дмитрий Иванов" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Дмитрий Иванов</h3>
              <p className="text-blue-600 mb-3">Диагност</p>
              <p className="text-gray-600">Опыт работы 8 лет. Сертифицированный специалист по диагностике.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}