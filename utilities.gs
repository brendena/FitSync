function staticVars() {
  return {
    "milliSecondsDay": 86400000,
    "milliSecondsMonth": 2592000000
  }
}


function convertMillisecondsToDate(milliSeconds){
  return new Date(milliSeconds).toString()
}
function convertNanosecondsToDate(nanoSeconds){
  return convertMillisecondsToDate(nanoSeconds/1000000)
}
function getDateWithOffset(dateChange){
  return new Date(dateChange.getTime() + new Date().getTimezoneOffset() * 60000)
}

var acivitys = ['In vehicle*','Biking*','On foot*','Still (not moving)*','Unknown (unable to detect activity)*','Tilting (sudden device gravity change)*','','Walking*','Running*','Aerobics','Badminton','Baseball','Basketball','Biathlon','Handbiking','Mountain biking','Road biking','Spinning','Stationary biking','Utility biking','Boxing','Calisthenics','Circuit training','Cricket','Dancing','Elliptical','Fencing','Football (American)','Football (Australian)','Football (Soccer)','Frisbee','Gardening','Golf','Gymnastics','Handball','Hiking','Hockey','Horseback riding','Housework','Jumping rope','Kayaking','Kettlebell training','Kickboxing','Kitesurfing','Martial arts','Meditation','Mixed martial arts','P90X exercises','Paragliding','Pilates','Polo','Racquetball','Rock climbing','Rowing','Rowing machine','Rugby','Jogging','Running on sand','Running (treadmill)','Sailing','Scuba diving','Skateboarding','Skating','Cross skating','Inline skating (rollerblading)','Skiing','Back-country skiing','Cross-country skiing','Downhill skiing','Kite skiing','Roller skiing','Sledding','Sleeping','Snowboarding','Snowmobile','Snowshoeing','Squash','Stair climbing','Stair-climbing machine','Stand-up paddleboarding','Strength training','Surfing','Swimming','Swimming (swimming pool)','Swimming (open water)','Table tennis (ping pong)','Team sports','Tennis','Treadmill (walking or running)','Volleyball','Volleyball (beach)','Volleyball (indoor)','Wakeboarding','Walking (fitness)','Nording walking','Walking (treadmill)','Waterpolo','Weightlifting','Wheelchair','Windsurfing','Yoga','Zumba','Diving','Ergometer','Ice skating','Indoor skating','Curling','','Other (unclassified fitness activity)','Light sleep','Deep sleep','REM sleep','Awake (during sleep cycle)','Crossfit','HIIT','Interval Training','Walking (stroller)','Elevator','Escalator','Archery','Softball',]

function convertActivityToName(activity){
  return acivitys[Number(activity)];
}
/*
as long string
"In vehicle*,Biking*,On foot*,Still (not moving)*,Unknown (unable to detect activity)*,Tilting (sudden device gravity change)*,,Walking*,Running*,Aerobics,Badminton,Baseball,Basketball,Biathlon,Handbiking,Mountain biking,Road biking,Spinning,Stationary biking,Utility biking,Boxing,Calisthenics,Circuit training,Cricket,Dancing,Elliptical,Fencing,Football (American),Football (Australian),Football (Soccer),Frisbee,Gardening,Golf,Gymnastics,Handball,Hiking,Hockey,Horseback riding,Housework,Jumping rope,Kayaking,Kettlebell training,Kickboxing,Kitesurfing,Martial arts,Meditation,Mixed martial arts,P90X exercises,Paragliding,Pilates,Polo,Racquetball,Rock climbing,Rowing,Rowing machine,Rugby,Jogging,Running on sand,Running (treadmill),Sailing,Scuba diving,Skateboarding,Skating,Cross skating,Inline skating (rollerblading),Skiing,Back-country skiing,Cross-country skiing,Downhill skiing,Kite skiing,Roller skiing,Sledding,Sleeping,Snowboarding,Snowmobile,Snowshoeing,Squash,Stair climbing,Stair-climbing machine,Stand-up paddleboarding,Strength training,Surfing,Swimming,Swimming (swimming pool),Swimming (open water),Table tennis (ping pong),Team sports,Tennis,Treadmill (walking or running),Volleyball,Volleyball (beach),Volleyball (indoor),Wakeboarding,Walking (fitness),Nording walking,Walking (treadmill),Waterpolo,Weightlifting,Wheelchair,Windsurfing,Yoga,Zumba,Diving,Ergometer,Ice skating,Indoor skating,Curling,,Other (unclassified fitness activity),Light sleep,Deep sleep,REM sleep,Awake (during sleep cycle),Crossfit,HIIT,Interval Training,Walking (stroller),Elevator,Escalator,Archery,Softball"
*/

/*
0:"In vehicle*"
1:"Biking*"
2:"On foot*"
3:"Still (not moving)*"
4:"Unknown (unable to detect activity)*"
5:"Tilting (sudden device gravity change)*"
7:"Walking*"
8:"Running*"
9:"Aerobics"
10:"Badminton"
11:"Baseball"
12:"Basketball"
13:"Biathlon"
14:"Handbiking"
15:"Mountain biking"
16:"Road biking"
17:"Spinning"
18:"Stationary biking"
19:"Utility biking"
20:"Boxing"
21:"Calisthenics"
22:"Circuit training"
23:"Cricket"
24:"Dancing"
25:"Elliptical"
26:"Fencing"
27:"Football (American)"
28:"Football (Australian)"
29:"Football (Soccer)"
30:"Frisbee"
31:"Gardening"
32:"Golf"
33:"Gymnastics"
34:"Handball"
35:"Hiking"
36:"Hockey"
37:"Horseback riding"
38:"Housework"
39:"Jumping rope"
40:"Kayaking"
41:"Kettlebell training"
42:"Kickboxing"
43:"Kitesurfing"
44:"Martial arts"
45:"Meditation"
46:"Mixed martial arts"
47:"P90X exercises"
48:"Paragliding"
49:"Pilates"
50:"Polo"
51:"Racquetball"
52:"Rock climbing"
53:"Rowing"
54:"Rowing machine"
55:"Rugby"
56:"Jogging"
57:"Running on sand"
58:"Running (treadmill)"
59:"Sailing"
60:"Scuba diving"
61:"Skateboarding"
62:"Skating"
63:"Cross skating"
64:"Inline skating (rollerblading)"
65:"Skiing"
66:"Back-country skiing"
67:"Cross-country skiing"
68:"Downhill skiing"
69:"Kite skiing"
70:"Roller skiing"
71:"Sledding"
72:"Sleeping"
73:"Snowboarding"
74:"Snowmobile"
75:"Snowshoeing"
76:"Squash"
77:"Stair climbing"
78:"Stair-climbing machine"
79:"Stand-up paddleboarding"
80:"Strength training"
81:"Surfing"
82:"Swimming"
83:"Swimming (swimming pool)"
84:"Swimming (open water)"
85:"Table tennis (ping pong)"
86:"Team sports"
87:"Tennis"
88:"Treadmill (walking or running)"
89:"Volleyball"
90:"Volleyball (beach)"
91:"Volleyball (indoor)"
92:"Wakeboarding"
93:"Walking (fitness)"
94:"Nording walking"
95:"Walking (treadmill)"
96:"Waterpolo"
97:"Weightlifting"
98:"Wheelchair"
99:"Windsurfing"
100:"Yoga"
101:"Zumba"
102:"Diving"
103:"Ergometer"
104:"Ice skating"
105:"Indoor skating"
106:"Curling"
108:"Other (unclassified fitness activity)"
109:"Light sleep"
110:"Deep sleep"
111:"REM sleep"
112:"Awake (during sleep cycle)"
113:"Crossfit"
114:"HIIT"
115:"Interval Training"
116:"Walking (stroller)"
117:"Elevator"
118:"Escalator"
119:"Archery"
120:"Softball"
*/
