# 🔐 시저 암호 변환기 (Caesar Cipher Converter)

> 율리우스 카이사르가 사용했던 고전 암호화 방식을 웹에서 직접 체험해 보세요.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## 📖 소개

**시저 암호(Caesar Cipher)**는 기원전 1세기경 율리우스 카이사르가 군사 통신에 사용한 것으로 알려진 가장 오래되고 단순한 치환 암호입니다. 알파벳을 일정한 수만큼 밀어서 다른 글자로 대체하는 방식으로 작동합니다.

예를 들어 시프트 값이 3이면:

```
원본:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
암호:  D E F G H I J K L M N O P Q R S T U V W X Y Z A B C

HELLO WORLD → KHOOR ZRUOG
```

이 프로젝트는 시저 암호의 원리를 시각적으로 이해하고, 직접 암호화/복호화를 체험할 수 있는 인터랙티브 웹 페이지입니다. 처음 접하는 사람도 "시저 암호란?" 설명 카드를 통해 쉽게 이해할 수 있습니다.

## ✨ 주요 기능

### 🔄 실시간 암호화 & 복호화
- 텍스트 입력 시 실시간으로 결과가 반영됩니다.
- **암호화(Encrypt)** / **복호화(Decrypt)** 모드를 전환할 수 있습니다.
- 시프트 값은 0부터 25까지 슬라이더 또는 ±버튼으로 조절 가능합니다.

### 🎡 시저 휠 시각화
- 외부 링(원본 알파벳)과 내부 링(변환 알파벳)으로 구성된 캔버스 기반 시저 휠이 시프트 값의 변화를 시각적으로 보여줍니다.

### 📊 알파벳 매핑 테이블
- 현재 시프트 값에 따른 전체 알파벳 매핑(A→D, B→E 등)을 표 형태로 확인할 수 있습니다.
- 입력된 텍스트에 포함된 문자는 하이라이트 표시됩니다.

### 🔍 브루트 포스 (Brute Force)
- 모든 26가지 시프트 결과를 한눈에 확인할 수 있습니다.
- 암호문만 있고 키를 모를 때 유용합니다.
- 결과를 클릭하면 해당 시프트 값이 자동 적용됩니다.

### 🔁 ROT13 빠른 변환
- 시저 암호의 가장 유명한 변형인 ROT13(Shift 13)을 버튼 하나로 적용할 수 있습니다.
- 한 번 더 적용하면 원래 문장으로 돌아옵니다.

### 📈 빈도 분석 (Frequency Analysis)
- 변환 결과 텍스트의 알파벳 빈도를 바 차트로 시각화합니다.
- 최다 출현 글자 Top 3과 비율을 통계로 제공합니다.
- 실제 암호 해독에 사용되는 빈도 분석 기법을 직접 체험할 수 있습니다.

### 🤖 자동 해독 추천 (Auto Decode)
- 복호화 모드에서 영어 사전 기반으로 가장 자연스러운 시프트 값을 자동으로 추천합니다.
- 인식된 영어 단어를 함께 표시하여 추천 근거를 보여줍니다.

### 🛡️ 암호 강도 분석 (Cipher Strength)
- 시저 암호의 보안 강도를 시각적으로 보여줍니다.
- 가능한 키 수(26개), 빈도 분석 취약점, 학습 목적의 암호임을 설명합니다.

### 🕐 변환 히스토리 (History)
- 변환 기록이 자동으로 저장됩니다 (최근 20건).
- `localStorage`를 사용하여 새로고침해도 기록이 유지됩니다.
- 히스토리 항목을 클릭하면 해당 상태를 복원할 수 있습니다.
- 개별 삭제 및 전체 삭제가 가능합니다.

### 🔀 입출력 교환
- 스왑 버튼을 눌러 출력 결과를 바로 입력으로 옮기고 모드를 전환합니다.

### 📋 클립보드 복사
- 변환 결과를 원클릭으로 클립보드에 복사할 수 있습니다.

### ⌨️ 키보드 단축키
| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + Shift + E` | 암호화 모드 전환 |
| `Ctrl/Cmd + Shift + D` | 복호화 모드 전환 |

## 🛠️ 기술 스택

- **HTML5** — 시맨틱 마크업
- **CSS3** — 다크 테마, 글래스모피즘, CSS 커스텀 속성, 마이크로 애니메이션
- **Vanilla JavaScript** — 프레임워크 없이 순수 JS로 구현
- **Canvas API** — 시저 휠 및 파티클 배경 애니메이션
- **localStorage** — 변환 히스토리 영구 저장

## 🚀 실행 방법

별도의 빌드 과정 없이 정적 파일을 서빙하면 됩니다.

```bash
# 저장소 클론
git clone https://github.com/Hi-p/caesar-cipher.git
cd caesar-cipher

# 간단한 로컬 서버 실행 (Python 3)
python3 -m http.server 8080

# 브라우저에서 열기
open http://localhost:8080
```

또는 `index.html` 파일을 브라우저에서 직접 열어도 동작합니다.

## 📁 프로젝트 구조

```
caesar-cipher/
├── index.html   # 메인 HTML 페이지
├── index.css    # 디자인 시스템 및 스타일
├── script.js    # 시저 암호 로직 및 UI 인터랙션
└── README.md    # 프로젝트 설명서
```
