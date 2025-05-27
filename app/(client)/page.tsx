import Link from 'next/link';
import { CalendarCheck, ShieldCheck, Settings, Zap, Clock, Wrench, Users, Award, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const services = [
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Диагностика",
      description: "Полная компьютерная диагностика всех систем автомобиля с использованием современного оборудования"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Электрика",
      description: "Ремонт электрооборудования, проводки, установка дополнительного оборудования"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Техобслуживание",
      description: "Плановое ТО по регламенту производителя с заменой всех необходимых расходников"
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Гарантийное обслуживание",
      description: "Обслуживание автомобилей на гарантии с сохранением официальной гарантии"
    }
  ];

  const features = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Опытные мастера",
      description: "Сертифицированные специалисты с опытом работы от 5 лет"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Гарантия качества",
      description: "Гарантия на все виды работ и установленные запчасти"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Быстро и качественно",
      description: "Оперативное выполнение работ без потери качества"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Индивидуальный подход",
      description: "Персональный менеджер и консультация по всем вопросам"
    }
  ];

  return (
    <div className="bg-gray-50">
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Профессиональный автосервис <span className="text-blue-400">Alan SS</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Качественный ремонт и профессиональное обслуживание вашего автомобиля с гарантией
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/booking" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center justify-center transition-colors"
            >
              <CalendarCheck className="mr-2" />
              Записаться онлайн
            </Link>
            
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши услуги</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Широкий спектр услуг по ремонту и обслуживанию автомобилей любых марок
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link 
                    href="/services" 
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    Подробнее
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Записаться на обслуживание</h2>
            <p className="text-xl text-gray-300 mb-8">
              Оставьте заявку прямо сейчас и получите скидку 10% на первое посещение
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/booking" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center justify-center transition-colors"
              >
                <CalendarCheck className="mr-2" />
                Записаться онлайн
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Контакты</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Адрес</h3>
              <p className="text-gray-600">г. Москва, ул. Примерная, д. 123</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Телефон</h3>
              <p className="text-gray-600">+7 (999) 999-99-99</p>
              <p className="text-gray-600">Пн-Вс: 9:00 - 21:00</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@alanss.ru</p>
              <p className="text-sm text-gray-500 mt-2">Ответим в течение часа</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}