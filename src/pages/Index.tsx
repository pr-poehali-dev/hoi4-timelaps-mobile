import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [selectedAggressor, setSelectedAggressor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [year, setYear] = useState(1936);
  const [conflicts, setConflicts] = useState<Array<{id: string, aggressor: string, target: string, status: 'active' | 'victory' | 'defeat'}>>([]);

  const countries = [
    'Германия', 'СССР', 'США', 'Великобритания', 'Франция', 'Италия', 
    'Япония', 'Китай', 'Польша', 'Австралия', 'Канада', 'Бразилия',
    'Турция', 'Испания', 'Швеция', 'Финляндия', 'Румыния', 'Венгрия'
  ];

  const conflictStatuses = {
    active: { color: 'bg-yellow-500', text: 'Активный' },
    victory: { color: 'bg-green-600', text: 'Победа' },
    defeat: { color: 'bg-red-600', text: 'Поражение' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear(prev => prev + 1);
        // Simulate AI conflicts
        if (Math.random() < 0.3) {
          const randomAggressor = countries[Math.floor(Math.random() * countries.length)];
          const randomTarget = countries[Math.floor(Math.random() * countries.length)];
          if (randomAggressor !== randomTarget) {
            setConflicts(prev => [...prev, {
              id: Date.now().toString(),
              aggressor: randomAggressor,
              target: randomTarget,
              status: 'active'
            }]);
          }
        }
      }, 2000 / speed[0]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, countries]);

  const startUserConflict = (aggressor: string, target: string) => {
    if (aggressor && target && aggressor !== target) {
      setConflicts(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        aggressor,
        target,
        status: 'active'
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 border-b border-amber-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Icon name="Globe" size={24} className="text-amber-500 md:w-8 md:h-8" />
            <h1 className="text-lg md:text-2xl font-bold text-amber-400">STRATEGIC COMMAND</h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Badge variant="outline" className="text-amber-400 border-amber-400 text-xs md:text-sm">
              {year} г.
            </Badge>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "destructive" : "default"}
              className="bg-red-800 hover:bg-red-700 text-xs md:text-sm px-2 md:px-4"
              size="sm"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={14} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">{isPlaying ? 'Пауза' : 'Запуск'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Map Area */}
        <div className="flex-1 relative bg-slate-700 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: `url('/img/5da588b4-e806-4774-b0ec-aa1836f78aa4.jpg')`,
              filter: 'sepia(0.3) contrast(1.2)'
            }}
          >
            {/* Interactive overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
            
            {/* Conflict markers */}
            {conflicts.slice(-10).map((conflict, index) => (
              <div
                key={conflict.id}
                className={`absolute w-4 h-4 rounded-full ${conflictStatuses[conflict.status].color} animate-pulse`}
                style={{
                  left: `${20 + index * 8}%`,
                  top: `${30 + index * 5}%`,
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap bg-slate-800 px-2 py-1 rounded">
                  {conflict.aggressor} → {conflict.target}
                </div>
              </div>
            ))}

            {/* Speed Control */}
            <div className="absolute bottom-4 left-4 bg-slate-800/90 p-2 md:p-4 rounded-lg">
              <div className="flex items-center space-x-1 md:space-x-2">
                <Icon name="Gauge" size={14} className="text-amber-400" />
                <span className="text-xs md:text-sm">Скорость:</span>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  max={5}
                  min={1}
                  step={1}
                  className="w-16 md:w-20"
                />
                <span className="text-amber-400 font-bold text-xs md:text-sm">{speed[0]}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 bg-slate-800 border-l border-amber-600 overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="p-4 space-y-4">
            
            {/* War Command */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-400">
                  <Icon name="Swords" size={20} className="mr-2" />
                  Командование войной
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Агрессор</label>
                  <Select value={selectedAggressor} onValueChange={setSelectedAggressor}>
                    <SelectTrigger className="bg-slate-600 border-slate-500">
                      <SelectValue placeholder="Выберите страну" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Цель</label>
                  <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                    <SelectTrigger className="bg-slate-600 border-slate-500">
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => startUserConflict(selectedAggressor, selectedTarget)}
                  className="w-full bg-red-800 hover:bg-red-700"
                  disabled={!selectedAggressor || !selectedTarget || selectedAggressor === selectedTarget}
                >
                  <Icon name="Sword" size={16} className="mr-2" />
                  Начать конфликт
                </Button>
              </CardContent>
            </Card>

            {/* Active Conflicts */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-400">
                  <Icon name="Activity" size={20} className="mr-2" />
                  Активные конфликты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {conflicts.slice(-5).map(conflict => (
                    <div key={conflict.id} className="flex items-center justify-between p-2 bg-slate-600 rounded">
                      <div className="text-sm">
                        <span className="text-red-400">{conflict.aggressor}</span>
                        <Icon name="ArrowRight" size={12} className="mx-1 inline" />
                        <span className="text-blue-400">{conflict.target}</span>
                      </div>
                      <Badge className={`${conflictStatuses[conflict.status].color} text-white text-xs`}>
                        {conflictStatuses[conflict.status].text}
                      </Badge>
                    </div>
                  ))}
                  {conflicts.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-4">Нет активных конфликтов</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game Features */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                <Icon name="Settings" size={16} className="mr-1" />
                Настройки
              </Button>
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                <Icon name="RotateCcw" size={16} className="mr-1" />
                Сброс
              </Button>
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                <Icon name="Save" size={16} className="mr-1" />
                Сохранить
              </Button>
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                <Icon name="Upload" size={16} className="mr-1" />
                Загрузить
              </Button>
            </div>

            {/* Military Stats */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-400">
                  <Icon name="BarChart3" size={20} className="mr-2" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Всего конфликтов:</span>
                    <span className="text-white font-bold">{conflicts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Активных:</span>
                    <span className="text-yellow-400 font-bold">
                      {conflicts.filter(c => c.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Текущий год:</span>
                    <span className="text-amber-400 font-bold">{year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;