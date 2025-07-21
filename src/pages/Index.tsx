import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Country {
  name: string;
  color: string;
  territories: number;
  strength: number;
}

interface Territory {
  id: string;
  name: string;
  owner: string;
  x: number;
  y: number;
  isCapital?: boolean;
}

interface Conflict {
  id: string;
  aggressor: string;
  target: string;
  status: 'active' | 'victory' | 'defeat';
  progress: number;
  capturedTerritories: string[];
}

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [selectedAggressor, setSelectedAggressor] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [year, setYear] = useState(2024);
  const [scenario, setScenario] = useState('modern');
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);

  const scenarios = {
    'ww2_1936': { year: 1936, name: 'Накануне войны' },
    'ww2_1939': { year: 1939, name: 'Начало ВМВ' },
    'modern': { year: 2024, name: 'Современный мир' }
  };

  const initializeScenario = (scenarioType: string) => {
    const scenarioData = scenarios[scenarioType as keyof typeof scenarios];
    setYear(scenarioData.year);
    
    if (scenarioType === 'modern') {
      setCountries([
        { name: 'США', color: '#4A90E2', territories: 50, strength: 100 },
        { name: 'Китай', color: '#D0021B', territories: 34, strength: 95 },
        { name: 'Россия', color: '#7ED321', territories: 85, strength: 85 },
        { name: 'Германия', color: '#50E3C2', territories: 16, strength: 75 },
        { name: 'Великобритания', color: '#B013A4', territories: 12, strength: 70 },
        { name: 'Франция', color: '#F5A623', territories: 13, strength: 68 },
        { name: 'Индия', color: '#FF6B35', territories: 28, strength: 80 },
        { name: 'Япония', color: '#8B572A', territories: 8, strength: 72 },
        { name: 'Бразилия', color: '#417505', territories: 26, strength: 60 },
        { name: 'Канада', color: '#9013FE', territories: 13, strength: 55 },
        { name: 'Австралия', color: '#FF4081', territories: 8, strength: 50 },
        { name: 'Южная Корея', color: '#00BCD4', territories: 9, strength: 65 },
        { name: 'Италия', color: '#795548', territories: 15, strength: 62 },
        { name: 'Турция', color: '#607D8B', territories: 7, strength: 58 },
        { name: 'Иран', color: '#E91E63', territories: 12, strength: 55 },
        { name: 'Украина', color: '#3F51B5', territories: 18, strength: 45 }
      ]);

      setTerritories([
        // США
        { id: 'usa_1', name: 'Калифорния', owner: 'США', x: 15, y: 45, isCapital: true },
        { id: 'usa_2', name: 'Техас', owner: 'США', x: 20, y: 50 },
        { id: 'usa_3', name: 'Флорида', owner: 'США', x: 25, y: 55 },
        // Россия
        { id: 'rus_1', name: 'Москва', owner: 'Россия', x: 55, y: 30, isCapital: true },
        { id: 'rus_2', name: 'Сибирь', owner: 'Россия', x: 70, y: 25 },
        { id: 'rus_3', name: 'Урал', owner: 'Россия', x: 65, y: 35 },
        // Китай
        { id: 'chn_1', name: 'Пекин', owner: 'Китай', x: 75, y: 45, isCapital: true },
        { id: 'chn_2', name: 'Шанхай', owner: 'Китай', x: 78, y: 50 },
        { id: 'chn_3', name: 'Гуанчжоу', owner: 'Китай', x: 73, y: 55 },
        // Европа
        { id: 'ger_1', name: 'Берлин', owner: 'Германия', x: 50, y: 35, isCapital: true },
        { id: 'fra_1', name: 'Париж', owner: 'Франция', x: 47, y: 38, isCapital: true },
        { id: 'gbr_1', name: 'Лондон', owner: 'Великобритания', x: 45, y: 32, isCapital: true },
        { id: 'ita_1', name: 'Рим', owner: 'Италия', x: 52, y: 45, isCapital: true },
        // Азия
        { id: 'jpn_1', name: 'Токио', owner: 'Япония', x: 85, y: 48, isCapital: true },
        { id: 'ind_1', name: 'Дели', owner: 'Индия', x: 68, y: 55, isCapital: true },
        { id: 'kor_1', name: 'Сеул', owner: 'Южная Корея', x: 82, y: 45, isCapital: true },
        // Другие
        { id: 'bra_1', name: 'Бразилиа', owner: 'Бразилия', x: 30, y: 70, isCapital: true },
        { id: 'can_1', name: 'Оттава', owner: 'Канада', x: 22, y: 25, isCapital: true },
        { id: 'aus_1', name: 'Канберра', owner: 'Австралия', x: 85, y: 75, isCapital: true },
        { id: 'tur_1', name: 'Анкара', owner: 'Турция', x: 57, y: 47, isCapital: true },
        { id: 'irn_1', name: 'Тегеран', owner: 'Иран', x: 62, y: 50, isCapital: true },
        { id: 'ukr_1', name: 'Киев', owner: 'Украина', x: 54, y: 38, isCapital: true }
      ]);
    } else if (scenarioType === 'ww2_1939') {
      setCountries([
        { name: 'Германия', color: '#2F2F2F', territories: 45, strength: 100 },
        { name: 'СССР', color: '#D0021B', territories: 120, strength: 95 },
        { name: 'Великобритания', color: '#4A90E2', territories: 35, strength: 85 },
        { name: 'США', color: '#7ED321', territories: 48, strength: 90 },
        { name: 'Франция', color: '#50E3C2', territories: 25, strength: 70 },
        { name: 'Италия', color: '#417505', territories: 20, strength: 65 },
        { name: 'Япония', color: '#FF6B35', territories: 15, strength: 80 },
        { name: 'Польша', color: '#B013A4', territories: 12, strength: 45 }
      ]);
    }
  };

  useEffect(() => {
    initializeScenario(scenario);
  }, [scenario]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear(prev => prev + 1);
        
        // Update active conflicts
        setConflicts(prev => prev.map(conflict => {
          if (conflict.status === 'active') {
            const newProgress = Math.min(conflict.progress + Math.random() * 10, 100);
            
            // Capture territories progressively
            if (newProgress > conflict.progress + 5) {
              const availableTerritories = territories.filter(t => 
                t.owner === conflict.target && 
                !conflict.capturedTerritories.includes(t.id)
              );
              
              if (availableTerritories.length > 0 && Math.random() < 0.4) {
                const capturedTerritory = availableTerritories[Math.floor(Math.random() * availableTerritories.length)];
                
                // Update territory owner
                setTerritories(prevTerritories => 
                  prevTerritories.map(t => 
                    t.id === capturedTerritory.id 
                      ? { ...t, owner: conflict.aggressor }
                      : t
                  )
                );
                
                return {
                  ...conflict,
                  progress: newProgress,
                  capturedTerritories: [...conflict.capturedTerritories, capturedTerritory.id],
                  status: newProgress >= 100 ? 'victory' : 'active'
                };
              }
            }
            
            return {
              ...conflict,
              progress: newProgress,
              status: newProgress >= 100 ? 'victory' : 'active'
            };
          }
          return conflict;
        }));

        // Random AI conflicts
        if (Math.random() < 0.1) {
          const availableCountries = countries.map(c => c.name);
          const randomAggressor = availableCountries[Math.floor(Math.random() * availableCountries.length)];
          const randomTarget = availableCountries[Math.floor(Math.random() * availableCountries.length)];
          
          if (randomAggressor !== randomTarget) {
            setConflicts(prev => {
              const existingConflict = prev.find(c => 
                c.aggressor === randomAggressor && c.target === randomTarget && c.status === 'active'
              );
              
              if (!existingConflict) {
                return [...prev, {
                  id: Date.now().toString(),
                  aggressor: randomAggressor,
                  target: randomTarget,
                  status: 'active' as const,
                  progress: 0,
                  capturedTerritories: []
                }];
              }
              return prev;
            });
          }
        }
      }, 3000 / speed[0]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, countries, territories]);

  const startUserConflict = (aggressor: string, target: string) => {
    if (aggressor && target && aggressor !== target) {
      setConflicts(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        aggressor,
        target,
        status: 'active',
        progress: 0,
        capturedTerritories: []
      }]);
      setSelectedAggressor('');
      setSelectedTarget('');
    }
  };

  const getCountryColor = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.color || '#666666';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 border-b border-amber-600 p-2 md:p-4">
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
              backgroundImage: `url('/img/80011e91-b038-4257-8deb-4f3fe370bab8.jpg')`,
              filter: 'contrast(1.1) brightness(0.9)'
            }}
          >
            {/* Territories overlay */}
            <div className="absolute inset-0">
              {territories.map((territory) => (
                <div
                  key={territory.id}
                  className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer transition-all hover:scale-150`}
                  style={{
                    left: `${territory.x}%`,
                    top: `${territory.y}%`,
                    backgroundColor: getCountryColor(territory.owner),
                    borderWidth: territory.isCapital ? '3px' : '2px',
                    boxShadow: territory.isCapital ? '0 0 10px rgba(255,215,0,0.8)' : 'none'
                  }}
                  title={`${territory.name} (${territory.owner})`}
                >
                  {territory.isCapital && (
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Active conflict indicators */}
            {conflicts.filter(c => c.status === 'active').map((conflict, index) => (
              <div
                key={conflict.id}
                className="absolute"
                style={{
                  left: `${20 + index * 10}%`,
                  top: `${25 + index * 8}%`
                }}
              >
                <div className="bg-red-600 text-white text-xs p-1 rounded animate-pulse border border-yellow-400">
                  <div className="flex items-center space-x-1">
                    <Icon name="Sword" size={10} />
                    <span>{conflict.aggressor.slice(0, 3)}</span>
                    <Icon name="ArrowRight" size={8} />
                    <span>{conflict.target.slice(0, 3)}</span>
                  </div>
                  <div className="w-16 bg-gray-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full transition-all"
                      style={{ width: `${conflict.progress}%` }}
                    ></div>
                  </div>
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
            
            {/* Scenario Selection */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-400 text-sm">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Исторический период
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={scenario} onValueChange={setScenario} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-600">
                    <TabsTrigger value="ww2_1936" className="text-xs">1936</TabsTrigger>
                    <TabsTrigger value="ww2_1939" className="text-xs">1939</TabsTrigger>
                    <TabsTrigger value="modern" className="text-xs">2024</TabsTrigger>
                  </TabsList>
                  <TabsContent value="modern" className="mt-2">
                    <p className="text-xs text-slate-300">Современный мир с реальными границами</p>
                  </TabsContent>
                  <TabsContent value="ww2_1939" className="mt-2">
                    <p className="text-xs text-slate-300">Начало Второй мировой войны</p>
                  </TabsContent>
                  <TabsContent value="ww2_1936" className="mt-2">
                    <p className="text-xs text-slate-300">Накануне большой войны</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* War Command */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-400 text-sm">
                  <Icon name="Swords" size={16} className="mr-2" />
                  Командование войной
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Агрессор</label>
                  <Select value={selectedAggressor} onValueChange={setSelectedAggressor}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 h-8 text-xs">
                      <SelectValue placeholder="Выберите страну" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.name} value={country.name}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: country.color }}
                            ></div>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Цель</label>
                  <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 h-8 text-xs">
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.name} value={country.name}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: country.color }}
                            ></div>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => startUserConflict(selectedAggressor, selectedTarget)}
                  className="w-full bg-red-800 hover:bg-red-700 h-8 text-xs"
                  disabled={!selectedAggressor || !selectedTarget || selectedAggressor === selectedTarget}
                >
                  <Icon name="Sword" size={12} className="mr-1" />
                  Начать конфликт
                </Button>
              </CardContent>
            </Card>

            {/* Active Conflicts */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-400 text-sm">
                  <Icon name="Activity" size={16} className="mr-2" />
                  Активные конфликты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {conflicts.filter(c => c.status === 'active').slice(-3).map(conflict => (
                    <div key={conflict.id} className="p-2 bg-slate-600 rounded border-l-4 border-red-500">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-2 h-2 rounded"
                            style={{ backgroundColor: getCountryColor(conflict.aggressor) }}
                          ></div>
                          <span className="text-red-400">{conflict.aggressor}</span>
                          <Icon name="ArrowRight" size={8} />
                          <div 
                            className="w-2 h-2 rounded"
                            style={{ backgroundColor: getCountryColor(conflict.target) }}
                          ></div>
                          <span className="text-blue-400">{conflict.target}</span>
                        </div>
                        <span className="text-yellow-400">{Math.round(conflict.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                        <div 
                          className="bg-red-500 h-1 rounded-full transition-all"
                          style={{ width: `${conflict.progress}%` }}
                        ></div>
                      </div>
                      {conflict.capturedTerritories.length > 0 && (
                        <div className="text-xs text-green-400 mt-1">
                          Захвачено: {conflict.capturedTerritories.length} территорий
                        </div>
                      )}
                    </div>
                  ))}
                  {conflicts.filter(c => c.status === 'active').length === 0 && (
                    <p className="text-slate-400 text-xs text-center py-2">Нет активных конфликтов</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Territory Stats */}
            <Card className="bg-slate-700 border-amber-600">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-400 text-sm">
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Статистика территорий
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                  {countries.slice(0, 6).map(country => {
                    const controlledTerritories = territories.filter(t => t.owner === country.name).length;
                    return (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded"
                            style={{ backgroundColor: country.color }}
                          ></div>
                          <span className="text-slate-300">{country.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{controlledTerritories}</span>
                          <div className="w-8 bg-slate-600 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full"
                              style={{ 
                                backgroundColor: country.color,
                                width: `${(controlledTerritories / territories.length) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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