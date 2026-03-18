# DEVTrails
**AI-Powered Parametric Insurance for Gig Workers**

A next-generation AI-driven parametric insurance platform designed to protect gig workers from income loss due to real-world disruptions like weather, pollution, and social events.

**🛡️ Project Overview**
India’s gig economy workers (delivery partners, drivers, freelancers) face unpredictable income loss due to external factors such as:
🌧️ Heavy Rainfall
🌡️ Extreme Heat
😷 Pollution
🚧 Traffic & Zone Closures
Traditional insurance systems are:
Slow ❌
Manual ❌
Complex ❌

**💡 Our Solution**
We built an AI-powered parametric insurance system that:
Predicts risk using machine learning
Calculates weekly dynamic premiums
Monitors real-time conditions
Automatically triggers instant payouts

**👤 Target Persona**

Segment: Food Delivery Partners (Zomato / Swiggy)
Location: Urban cities (e.g., Mumbai Metropolitan Area)
Pain Point: External disruptions cause 20–30% loss in monthly earnings

**🔄 User Workflow**

1. Onboarding : Worker registers using platform ID & location
2. Risk Profiling : AI analyzes historical + real-time disruption data
3. Weekly Policy : Premium calculated weekly (aligned with payout cycle)
4. Automated Protection : If trigger condition is met → instant payout (no claim needed)
   
**💰 Weekly Pricing & Financial Model**
**📌 Core Formula**
        Pw=B+(Rm × σ)
Where:
Pw → Weekly Premium
B → Base Premium
Rm → AI Risk Multiplier
σ → Volatility Index

**💡 Key Rules**
Premium charged every Monday
Coverage = Only income loss (lost working hours)
❌ No health, life, or vehicle coverage

**🤖 AI Risk Multiplier Model**
The AI calculates risk using Disruption Vectors:
| Vector             | Data Source       | Impact   |
| ------------------ | ----------------- | -------- |
| Precipitation Risk | Weather API       | High     |
| Environmental Risk | AQI Data          | Medium   |
| Social Volatility  | Curfews / Strikes | Variable |
| Historical Safety  | Past Claims       | Discount |

**⚙️ Premium Engine**
import math

class PremiumEngine:
    def __init__(self, base_premium):
        self.base_premium = base_premium

    def calculate_risk_multiplier(self, rain_prob, aqi, social_risk_score):
        rain_factor = 1.0 + (rain_prob * 1.5)
        aqi_factor = 1.0 + (max(0, aqi - 100) / 400)
        social_factor = 1.0 + social_risk_score

        risk_multiplier = (rain_factor * aqi_factor * social_factor)
        return round(risk_multiplier, 2)

    def get_weekly_premium(self, rain_prob, aqi, social_risk_score, volatility_index):
        rm = self.calculate_risk_multiplier(rain_prob, aqi, social_risk_score)
        weekly_premium = self.base_premium + (rm * volatility_index)

        return {
            "Base_Rate": self.base_premium,
            "Risk_Multiplier": rm,
            "Volatility_Index": volatility_index,
            "Total_Weekly_Premium": round(weekly_premium, 2)
        }

**🌩️ Parametric Triggers (Auto Payout)**
Payouts are triggered automatically when:
🌧️ Rainfall > 50mm in 3 hours
🌡️ Temperature > 45°C
🚧 Curfew / Zone Shutdown
📱 Platform outage (simulated API)
👉 No manual claim filing required.

**🧠 Intelligent Fraud Detection**
Our system detects fraud using AI-based behavioral analysis:

🔍 Detection Techniques
🚀 Velocity Check → Impossible speed detection
📍 GPS Jitter Analysis → Real vs fake location
🔄 Zone Verification → Delivery area matching
📱 Device Integrity → Mock location detection

**Fraud Detection Module**
import time
import math

class FraudDetector:
    def __init__(self):
        self.last_location = None
        self.last_timestamp = None

    def calculate_distance(self, coord1, coord2):
        lat1, lon1 = coord1
        lat2, lon2 = coord2
        radius = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return radius * c

    def validate_activity(self, current_lat, current_lon, is_mock_enabled=False):
        current_time = time.time()

        if is_mock_enabled:
            return False, "FRAUD_DETECTED: Mock location active"

        if self.last_location and self.last_timestamp:
            distance = self.calculate_distance(self.last_location, (current_lat, current_lon))
            time_diff = (current_time - self.last_timestamp) / 3600

            if time_diff > 0:
                speed = distance / time_diff
                if speed > 100:
                    return False, f"FRAUD_DETECTED: Speed anomaly ({round(speed,2)} km/h)"

        self.last_location = (current_lat, current_lon)
        self.last_timestamp = current_time
        return True, "LOCATION_VERIFIED"


**Admin Analytics Dashboard**
1️⃣ Fraud & Integrity Metrics
Fraud Trigger Rate
GPS Variance Heatmap
Device-to-User Ratio
Claim Correlation Score
2️⃣ Financial Metrics
Loss Ratio
Zone-wise Risk Exposure
Premium Collection Rate
3️⃣ Operational Metrics
Instant Payout Time
Active Coverage Volume
Disruption Frequency

**Sample Admin Data**
admin_metrics = {
    "system_health": {
        "active_partners": 1250,
        "total_premiums_weekly": 41250.00,
        "current_loss_ratio": 0.62
    },
    "fraud_alerts": {
        "flagged_claims_today": 14,
        "gps_spoofing_attempts": 8,
        "duplicate_device_warnings": 3
    },
    "trigger_status": {
        "active_disruptions": ["Heavy Rain - Zone A", "High AQI - Zone D"],
        "predicted_risk_next_week": "High (Monsoon Arrival)"
    }
}

**💻 Tech Stack**
Platform :  Mobile-first (for real-time worker access)
Frontend : React Native / Flutter
Backend : Python (Flask / FastAPI)
AI/ML : Scikit-learn / TensorFlow
APIs :OpenWeather API, Google Maps API, AQI APIs, Payment Gateway (Sandbox)

**Key Features**

✔ AI-based risk prediction
✔ Dynamic weekly premium
✔ Parametric auto payout
✔ Fraud detection system
✔ Real-time alerts
✔ Admin analytics dashboard

**Impact**
This platform enables:
Financial stability for gig workers
Faster and fair insurance claims
Scalable insurtech solutions
Data-driven risk management

**Future Scope**
Blockchain-based smart contracts
Integration with gig platforms
Mobile wallet payouts
Advanced deep learning models


