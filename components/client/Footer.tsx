import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Alan SS</h3>
            <p className="text-gray-300">
              Профессиональный автосервис с 2010 года. 
              Качественный ремонт и обслуживание автомобилей.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+7 (123) 456-78-90</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>г. Москва, ул. Автосервисная, 15</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition">
                Главная
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition">
                О нас
              </Link>
              <Link href="/services" className="block text-gray-300 hover:text-white transition">
                Услуги
              </Link>
              <Link href="/contacts" className="block text-gray-300 hover:text-white transition">
                Контакты
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Alan SS. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}