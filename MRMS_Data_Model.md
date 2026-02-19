# Military Resource Management System (MRMS) - Complete Data Model

## Executive Summary
This document defines the complete data model for MRMS with 5 core entities, their relationships, constraints, and normalization following 3NF principles.

---

## 1. ENTITY DEFINITIONS

### 1.1 BASES Entity

**Table Name:** bases

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| base_id | UUID/Unique Integer | PRIMARY KEY | Unique identifier for the base |
| base_name | VARCHAR(100) | NOT NULL, UNIQUE | Name of the military base |
| base_code | VARCHAR(10) | NOT NULL, UNIQUE | Alphanumeric code (e.g., "BASE-01") |
| location | VARCHAR(255) | NOT NULL | Geographic location |
| latitude | DECIMAL(10,8) | NULL | GPS latitude coordinate |
| longitude | DECIMAL(11,8) | NULL | GPS longitude coordinate |
| base_type | ENUM | NOT NULL | Type: ARMY_BASE, NAVAL_BASE, AIR_BASE, MARINE_BASE |
| commander_id | UUID/Integer | FOREIGN KEY (soldiers.soldier_id) | FK to commanding officer |
| max_capacity | INTEGER | NOT NULL, > 0 | Maximum personnel capacity |
| current_occupancy | INTEGER | Default 0 | Current number of personnel |
| max_equipment_capacity | INTEGER | NOT NULL, > 0 | Maximum equipment units allowed |
| current_equipment_count | INTEGER | Default 0 | Current equipment units |
| establishment_date | DATE | NOT NULL | When base was established |
| status | ENUM | NOT NULL | Status: ACTIVE, INACTIVE, UNDER_MAINTENANCE, DECOMMISSIONED |
| region | VARCHAR(50) | NOT NULL | Region/Command area |
| phone | VARCHAR(20) | NULL | Contact phone number |
| email | VARCHAR(100) | NULL | Contact email |
| is_operational | BOOLEAN | Default TRUE | Operational status |
| created_at | TIMESTAMP | Auto | Record creation timestamp |
| updated_at | TIMESTAMP | Auto | Record update timestamp |

**Primary Key:** base_id
**Foreign Keys:** commander_id → soldiers.soldier_id
**Unique Constraints:** base_name, base_code
**Indexes:** base_code, commander_id, status, region

---

### 1.2 SOLDIERS Entity

**Table Name:** soldiers

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| soldier_id | UUID/Unique Integer | PRIMARY KEY | Unique identifier for soldier |
| military_id | VARCHAR(20) | NOT NULL, UNIQUE | Armed forces service number |
| first_name | VARCHAR(50) | NOT NULL | Soldier's first name |
| last_name | VARCHAR(50) | NOT NULL | Soldier's last name |
| date_of_birth | DATE | NOT NULL | Birth date |
| age | INTEGER | Calculated | Calculated from DOB |
| gender | ENUM | NOT NULL | MALE, FEMALE, OTHER |
| rank | ENUM | NOT NULL | Rank list (see section 3.1) |
| specialization | VARCHAR(100) | NULL | Military specialty (e.g., Combat Medic, Pilot) |
| unit_id | UUID/Integer | FOREIGN KEY (units.unit_id) | Primary unit assignment |
| base_id | UUID/Integer | FOREIGN KEY (bases.base_id) | Home base |
| date_of_commission | DATE | NOT NULL | Commissioning/enrollment date |
| years_of_service | INTEGER | Calculated | Calculated from commission date |
| medical_status | ENUM | NOT NULL | ACTIVE, INJURED, SICK_LEAVE, ON_LEAVE, DECEASED |
| security_clearance | VARCHAR(50) | NOT NULL | Clearance level: NONE, LEVEL_1, LEVEL_2, LEVEL_3, TOP_SECRET |
| contact_number | VARCHAR(20) | NOT NULL | Personal contact number |
| emergency_contact | VARCHAR(100) | NULL | Emergency contact name |
| emergency_contact_number | VARCHAR(20) | NULL | Emergency contact phone |
| address | TEXT | NULL | Home address |
| qualifications | TEXT | NULL | JSON/Array of certifications |
| performance_rating | DECIMAL(3,2) | Range 0-5 | Annual performance score |
| status | ENUM | NOT NULL | ACTIVE, RETIRED, DISCHARGED, DECEASED, ON_LEAVE |
| created_at | TIMESTAMP | Auto | Record creation timestamp |
| updated_at | TIMESTAMP | Auto | Record update timestamp |

**Primary Key:** soldier_id
**Foreign Keys:** unit_id → units.unit_id, base_id → bases.base_id
**Unique Constraints:** military_id
**Indexes:** military_id, rank, unit_id, base_id, status

---

### 1.3 UNITS Entity

**Table Name:** units

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| unit_id | UUID/Unique Integer | PRIMARY KEY | Unique identifier for unit |
| unit_name | VARCHAR(100) | NOT NULL | Full name of military unit |
| unit_code | VARCHAR(10) | NOT NULL, UNIQUE | Alphanumeric code (e.g., "ALPHA-1") |
| unit_type | ENUM | NOT NULL | INFANTRY, CAVALRY, ARMOR, ARTILLERY, SUPPORT, LOGISTICS, SPECIAL_FORCES |
| commander_id | UUID/Integer | NOT NULL, FOREIGN KEY | FK to commanding officer (soldiers.soldier_id) |
| deputy_commander_id | UUID/Integer | NULL, FOREIGN KEY | FK to deputy commander |
| base_id | UUID/Integer | NOT NULL, FOREIGN KEY | Home base (bases.base_id) |
| authorized_strength | INTEGER | NOT NULL, > 0 | Authorized personnel capacity |
| current_strength | INTEGER | Default 0 | Current personnel count |
| specialized_equipment | VARCHAR(255) | NULL | Primary equipment types assigned |
| formation_date | DATE | NOT NULL | When unit was formed |
| operational_area | VARCHAR(255) | NULL | Area of operations |
| battle_honors | TEXT | NULL | Historical achievements/decorations |
| motto | VARCHAR(255) | NULL | Unit motto |
| status | ENUM | NOT NULL | ACTIVE, INACTIVE, DISBANDED, TRAINING, DEPLOYED |
| created_at | TIMESTAMP | Auto | Record creation timestamp |
| updated_at | TIMESTAMP | Auto | Record update timestamp |

**Primary Key:** unit_id
**Foreign Keys:** 
  - commander_id → soldiers.soldier_id
  - deputy_commander_id → soldiers.soldier_id
  - base_id → bases.base_id
**Unique Constraints:** unit_code
**Indexes:** unit_code, commander_id, base_id, status

---

### 1.4 EQUIPMENT Entity

**Table Name:** equipment

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| equipment_id | UUID/Unique Integer | PRIMARY KEY | Unique identifier for equipment |
| equipment_code | VARCHAR(20) | NOT NULL, UNIQUE | Serial/asset number |
| equipment_name | VARCHAR(100) | NOT NULL | Common name of equipment |
| equipment_type | ENUM | NOT NULL | Equipment type (see section 3.2) |
| equipment_category | VARCHAR(50) | NOT NULL | Category: WEAPON, VEHICLE, COMMUNICATION, MEDICAL, LOGISTICS, OTHER |
| manufacturer | VARCHAR(100) | NOT NULL | Manufacturing company |
| model | VARCHAR(100) | NOT NULL | Model/variant name |
| serial_number | VARCHAR(50) | NOT NULL, UNIQUE | Manufacturer serial number |
| manufacture_date | DATE | NOT NULL | Date of manufacture |
| acquisition_date | DATE | NOT NULL | Date acquired by military |
| acquisition_cost | DECIMAL(12,2) | NOT NULL | Purchase price |
| base_id | UUID/Integer | NOT NULL, FOREIGN KEY | Assigned base (bases.base_id) |
| unit_id | UUID/Integer | NULL, FOREIGN KEY | Assigned to specific unit |
| assigned_to_soldier_id | UUID/Integer | NULL, FOREIGN KEY | Assigned to specific soldier |
| status | ENUM | NOT NULL | Status (see section 3.3) |
| condition | ENUM | NOT NULL | EXCELLENT, GOOD, FAIR, POOR, DESTROYED |
| maintenance_status | ENUM | NOT NULL | OPERATIONAL, NEEDS_MAINTENANCE, UNDER_MAINTENANCE, DECOMMISSIONED |
| last_maintenance_date | DATE | NULL | Last maintenance performed |
| next_maintenance_due | DATE | NULL | Next scheduled maintenance |
| maintenance_cost | DECIMAL(10,2) | Default 0 | Annual maintenance cost |
| operational_hours | INTEGER | Default 0 | Total operating hours/usage count |
| location_details | VARCHAR(255) | NULL | Specific storage location |
| is_tracked | BOOLEAN | Default FALSE | GPS tracking enabled |
| warranty_expiry_date | DATE | NULL | Warranty expiration |
| documentation | TEXT | NULL | JSON reference to manuals/specs |
| created_at | TIMESTAMP | Auto | Record creation timestamp |
| updated_at | TIMESTAMP | Auto | Record update timestamp |

**Primary Key:** equipment_id
**Foreign Keys:**
  - base_id → bases.base_id
  - unit_id → units.unit_id
  - assigned_to_soldier_id → soldiers.soldier_id
**Unique Constraints:** equipment_code, serial_number
**Indexes:** equipment_code, base_id, unit_id, status, condition

---

### 1.5 MISSIONS Entity

**Table Name:** missions

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| mission_id | UUID/Unique Integer | PRIMARY KEY | Unique identifier for mission |
| mission_code | VARCHAR(20) | NOT NULL, UNIQUE | Mission identifier |
| mission_name | VARCHAR(150) | NOT NULL | Operation/mission name |
| mission_type | ENUM | NOT NULL | COMBAT, PATROL, TRAINING, RESCUE, SURVEILLANCE, TRANSPORT, SUPPORT |
| mission_classification | ENUM | NOT NULL | UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP_SECRET |
| unit_id | UUID/Integer | NOT NULL, FOREIGN KEY | Assigned unit (units.unit_id) |
| commander_id | UUID/Integer | NOT NULL, FOREIGN KEY | Mission commander (soldiers.soldier_id) |
| base_id | UUID/Integer | NOT NULL, FOREIGN KEY | Base of operations (bases.base_id) |
| objective | TEXT | NOT NULL | Mission objective description |
| target_location | VARCHAR(255) | NOT NULL | Geographic target area |
| target_latitude | DECIMAL(10,8) | NULL | GPS latitude of target |
| target_longitude | DECIMAL(11,8) | NULL | GPS longitude of target |
| scheduled_start_date | DATE | NOT NULL | Planned mission start |
| scheduled_end_date | DATE | NOT NULL | Planned mission end |
| actual_start_date | DATE | NULL | When mission actually started |
| actual_end_date | DATE | NULL | When mission actually ended |
| duration_days | INTEGER | Calculated | Mission duration in days |
| estimated_personnel_required | INTEGER | NOT NULL, > 0 | Planned personnel count |
| actual_personnel_assigned | INTEGER | default 0 | Actual assigned personnel |
| equipment_required | TEXT | NULL | JSON array of equipment codes |
| priority | ENUM | NOT NULL | CRITICAL, HIGH, MEDIUM, LOW |
| status | ENUM | NOT NULL | Status (see section 3.4) |
| risk_level | ENUM | NOT NULL | LOW, MEDIUM, HIGH, CRITICAL |
| casualties_count | INTEGER | Default 0 | Number of casualties |
| mission_cost_estimate | DECIMAL(12,2) | NULL | Budgeted cost |
| actual_mission_cost | DECIMAL(12,2) | NULL | Actual cost incurred |
| outcome | ENUM | NULL | SUCCESS, PARTIAL_SUCCESS, FAILURE, ABORTED |
| notes | TEXT | NULL | Mission notes/observations |
| created_at | TIMESTAMP | Auto | Record creation timestamp |
| updated_at | TIMESTAMP | Auto | Record update timestamp |

**Primary Key:** mission_id
**Foreign Keys:**
  - unit_id → units.unit_id
  - commander_id → soldiers.soldier_id
  - base_id → bases.base_id
**Unique Constraints:** mission_code
**Indexes:** mission_code, unit_id, status, priority

---

## 2. RELATIONSHIP DEFINITIONS

### 2.1 Entity Relationship Diagram (ERD) Text Representation

```
BASES (1) ──── (M) SOLDIERS
  |              |
  |              └─→ UNITS (1) ──── (M) EQUIPMENT
  |                     |
  |                     └─→ (M) MISSIONS
  |
  └─→ (M) UNITS
  └─→ (M) EQUIPMENT
  └─→ (M) MISSIONS (deployed from)

SOLDIERS (1) ──── (M) MISSIONS (as commander)
SOLDIERS (1) ──── (M) EQUIPMENT (assigned)
SOLDIERS (M) ──── (1) UNITS (member)
```

### 2.2 Relationship Details

#### Relationship 1: Base → Soldiers (One-to-Many)
- **Description:** A base has multiple soldiers stationed there
- **Foreign Key:** soldiers.base_id → bases.base_id
- **Cardinality:** 1:M
- **Rule:** Each soldier belongs to one base (home base)

#### Relationship 2: Base → Commanders (One-to-One)
- **Description:** Each base has one commanding officer
- **Foreign Key:** bases.commander_id → soldiers.soldier_id
- **Cardinality:** 1:1
- **Rule:** Commander must be a soldier with officer rank

#### Relationship 3: Soldiers → Units (Many-to-One)
- **Description:** Multiple soldiers belong to one unit
- **Foreign Key:** soldiers.unit_id → units.unit_id
- **Cardinality:** M:1
- **Rule:** Soldier must be assigned to a unit

#### Relationship 4: Unit → Commander (One-to-One)
- **Description:** Each unit has one commanding officer
- **Foreign Key:** units.commander_id → soldiers.soldier_id
- **Cardinality:** 1:1
- **Rule:** Unit commander is a soldier with rank CAPTAIN or higher

#### Relationship 5: Unit → Deputy Commander (One-to-One/Optional)
- **Description:** Unit optionally has a deputy commander
- **Foreign Key:** units.deputy_commander_id → soldiers.soldier_id
- **Cardinality:** 1:0..1
- **Rule:** Deputy commander is optional, must be rank LIEUTENANT or higher

#### Relationship 6: Base → Units (One-to-Many)
- **Description:** Base hosts multiple units
- **Foreign Key:** units.base_id → bases.base_id
- **Cardinality:** 1:M
- **Rule:** Each unit is stationed at one base

#### Relationship 7: Base → Equipment (One-to-Many)
- **Description:** Equipment is stored/issued from a base
- **Foreign Key:** equipment.base_id → bases.base_id
- **Cardinality:** 1:M
- **Rule:** Each equipment belongs to one base for storage/accountability

#### Relationship 8: Unit → Equipment (One-to-Many/Optional)
- **Description:** Unit may have equipment assigned
- **Foreign Key:** equipment.unit_id → units.unit_id
- **Cardinality:** 1:0..M
- **Rule:** Equipment can be assigned to one unit or unassigned

#### Relationship 9: Soldier → Equipment (One-to-Many/Optional)
- **Description:** Soldier may be assigned specific equipment
- **Foreign Key:** equipment.assigned_to_soldier_id → soldiers.soldier_id
- **Cardinality:** 1:0..M
- **Rule:** Equipment can be issued to individual soldier

#### Relationship 10: Unit → Missions (One-to-Many)
- **Description:** Unit is assigned multiple missions
- **Foreign Key:** missions.unit_id → units.unit_id
- **Cardinality:** 1:M
- **Rule:** Each mission is assigned to one unit

#### Relationship 11: Soldier → Missions (One-to-Many)
- **Description:** Officer commands multiple missions
- **Foreign Key:** missions.commander_id → soldiers.soldier_id
- **Cardinality:** 1:M
- **Rule:** Each mission must have one commander

#### Relationship 12: Base → Missions (One-to-Many)
- **Description:** Missions deploy from a base
- **Foreign Key:** missions.base_id → bases.base_id
- **Cardinality:** 1:M
- **Rule:** Each mission operates from one base

---

## 3. ENUMERATION VALUES

### 3.1 Military Ranks (Hierarchical)

**Officers:**
1. Field Marshal (FM)
2. General (Gen)
3. Lieutenant General (Lt Gen)
4. Major General (Maj Gen)
5. Brigadier (Brig)
6. Colonel (Col)
7. Lieutenant Colonel (Lt Col)
8. Major (Maj)
9. Captain (Capt)
10. Lieutenant (Lt)
11. Second Lieutenant (2Lt)

**Junior Commissioned Officers (JCO):**
12. Naib Subedar Major (NSM)
13. Subedar Major (SM)
14. Subedar (Sbu)
15. Naib Subedar (NS)

**Other Ranks (OR):**
16. Havildar Major (HM)
17. Havildar (Hav)
18. Naik (NK)
19. Lance Naik (LNk)
20. Sepoy (Sep) / Soldier

### 3.2 Equipment Types

**Weapons:**
- Assault Rifle (M16, AK-47, INSAS)
- Sniper Rifle
- Pistol
- Shotgun
- Rocket Launcher
- Grenade Launcher
- Machine Gun (Light, Medium, Heavy)
- Mortar
- Howitzer
- Tank Gun
- Aircraft Cannon

**Vehicles:**
- Main Battle Tank (MBT)
- Infantry Fighting Vehicle (IFV)
- Armored Personnel Carrier (APC)
- Jeep/Light Vehicle
- Truck (Cargo, Fuel)
- Helicopter
- Aircraft
- Drone/UAV

**Communication:**
- Radio Set (Portable, Vehicle-mounted)
- Satellite Phone
- Communication Tower

**Medical:**
- First Aid Kit
- Field Hospital Equipment
- Ambulance
- Stretcher

**Logistics:**
- Tent
- Cot
- Sleeping Bag
- Ration Pack
- Water Container
- Generator

**Other:**
- Night Vision Equipment
- Body Armor
- Helmet
- Compass/GPS Navigation

### 3.3 Equipment Status

- **OPERATIONAL** - Ready for use
- **IN_USE** - Currently deployed/in use
- **NEEDS_MAINTENANCE** - Requires service
- **UNDER_MAINTENANCE** - Currently being serviced
- **STORED** - Stored at base
- **IN_TRANSIT** - Being transported
- **DECOMMISSIONED** - No longer in service
- **DAMAGED** - Damaged beyond repair
- **LOST** - Missing/unaccounted
- **STOLEN** - Reported stolen

### 3.4 Mission Status

- **PLANNED** - Mission in planning phase
- **AUTHORIZED** - Approved for execution
- **SCHEDULED** - Scheduled for specific date
- **ACTIVE** - Currently ongoing
- **SUSPENDED** - Temporarily halted
- **COMPLETED** - Mission accomplished
- **FAILED** - Mission unsuccessful
- **ABORTED** - Mission cancelled
- **ON_HOLD** - Delayed indefinitely
- **COMPROMISED** - Security breach

### 3.5 Medical Status

- **ACTIVE** - Fully operational
- **INJURED** - Injured but serviceable
- **SICK_LEAVE** - Temporary medical leave
- **ON_LEAVE** - Personal/casual leave
- **HOSPITALIZED** - In military hospital
- **PERMANENTLY_DISABLED** - Unfit for service
- **DECEASED** - Killed in action or natural death

---

## 4. BUSINESS RULES & CONSTRAINTS

### 4.1 Base Constraints

```
RULE 1: Base Capacity
  - Constraint: current_occupancy ≤ max_capacity
  - Enforcement: Check before soldier assignment
  - Error: Cannot assign soldier if base is at capacity

RULE 2: Equipment Capacity
  - Constraint: current_equipment_count ≤ max_equipment_capacity
  - Enforcement: Check before equipment assignment
  - Error: Cannot assign equipment if base storage is full

RULE 3: Commander Assignment
  - Constraint: Base commander must have rank ≥ Colonel
  - Enforcement: Validate soldier rank before assignment
  - Error: Only officers of rank Colonel or above

RULE 4: Base Status
  - Constraint: Only ACTIVE bases can have new assignments
  - Exception: UNDER_MAINTENANCE can receive supplies
  - Enforcement: Status validation on all transactions
```

### 4.2 Soldier Constraints

```
RULE 5: Military ID Uniqueness
  - Constraint: military_id is globally unique
  - Enforcement: Database unique constraint
  - Duplicate prevention: Check registration

RULE 6: Age Validation
  - Constraint: age ≥ 18 and age ≤ 65
  - Enforcement: Calculate from DOB
  - Exception: Officers can go until 60+ based on rank

RULE 7: Rank-Role Mapping
  - Constraint: Unit commander must have rank ≥ Captain
  - Deputy commander must have rank ≥ Lieutenant
  - Regular soldier: Any rank
  - Enforcement: Application logic + database constraints

RULE 8: Service Duration
  - Constraint: Service duration cannot decrease
  - Enforcement: Check on employment_date changes
  - Logical: years_of_service = current_year - commission_year

RULE 9: Status Transitions
  - Valid transitions: ACTIVE → ON_LEAVE → ACTIVE
  - Valid transitions: ACTIVE → RETIRED / DISCHARGED / DECEASED
  - Invalid: RETIRED → ACTIVE (no reversal)
  - Enforcement: Application state machine
```

### 4.3 Unit Constraints

```
RULE 10: Unit Strength
  - Constraint: current_strength ≤ authorized_strength
  - Enforcement: Check before soldier addition
  - Error: Cannot exceed authorized capacity

RULE 11: Commander Assignment
  - Constraint: Unit must have one commander
  - Must be of rank Captain or above
  - Cannot be changed during active mission
  - Enforcement: Validation on assignment/update

RULE 12: Minimum Personnel
  - Constraint: Unit must have ≥ 1 officer (commander)
  - Enforcement: Required field validation
  - Must exist before mission deployment
```

### 4.4 Equipment Constraints

```
RULE 13: Equipment Ownership
  - Constraint: Each equipment belongs to exactly one base (base_id required)
  - Can be assigned to 0 or 1 unit
  - Can be assigned to 0 or 1 soldier
  - Enforcement: FK constraints

RULE 14: Equipment Status Logic
  - Constraint: DECOMMISSIONED equipment cannot be deployed
  - Constraint: DAMAGED equipment cannot be used
  - Constraint: Equipment in transit cannot be reassigned
  - Enforcement: Status checks before operations

RULE 15: Maintenance Requirements
  - Constraint: Equipment with status NEEDS_MAINTENANCE cannot be deployed
  - If under_maintenance = TRUE, status must be UNDER_MAINTENANCE
  - Enforcement: State validation

RULE 16: Assignment Levels
  - Equipment assigned to soldier:
    - Soldier must be in unit with base having equipment
    - Status must be OPERATIONAL or IN_USE
  - Enforcement: Multi-level FK validation
```

### 4.5 Mission Constraints

```
RULE 17: Mission Classification
  - CLASSIFIED missions can only be viewed by authorized personnel
  - Enforcement: Application-level access control
  - Audit: Log all access attempts

RULE 18: Mission Timeline
  - Constraint: scheduled_start_date < scheduled_end_date
  - Constraint: scheduled_start_date ≥ today (for future missions)
  - Constraint: actual_start_date ≤ actual_end_date (if both filled)
  - Enforcement: Date validation

RULE 19: Personnel Allocation
  - Constraint: actual_personnel_assigned ≤ unit.current_strength
  - Cannot assign more personnel than unit has
  - Enforcement: Check before mission start

RULE 20: Equipment for Missions
  - Constraint: All equipment in mission must be OPERATIONAL
  - Must belong to unit's base
  - Must not already be decommissioned
  - Enforcement: Equipment status validation

RULE 21: Mission Status Flow
  - Valid sequence: PLANNED → AUTHORIZED → SCHEDULED → ACTIVE → COMPLETED
  - Can move to SUSPENDED or ABORTED from any state
  - Cannot go from COMPLETED back to ACTIVE
  - Enforcement: State machine validation

RULE 22: Outcome Assignment
  - Outcome field is required only when status = COMPLETED or FAILED
  - Enforcement: Conditional requirement validation

RULE 23: Casualties Tracking
  - casualties_count ≥ 0
  - Should trigger INJURED status for soldiers
  - Enforcement: Application logic after mission completion
```

### 4.6 Data Integrity Rules

```
RULE 24: Referential Integrity
  - Cannot delete base if it has assigned soldiers/units/equipment
  - Cannot delete unit if it has assigned soldiers/equipment
  - Cannot delete soldier if assigned to active mission
  - Enforcement: ON DELETE CASCADE or RESTRICT

RULE 25: Audit Trail
  - Create_at and updated_at maintained automatically
  - All changes logged with timestamp
  - Enforcement: Database triggers or application code

RULE 26: Cost Tracking
  - mission_cost_estimate must be ≥ 0
  - actual_mission_cost must be ≥ 0
  - actual ≤ 1.5 × estimate (flag if exceeded)
  - Enforcement: Validation and alerts
```

---

## 5. NORMALIZATION ANALYSIS (3NF Compliance)

### 5.1 First Normal Form (1NF)
✅ **Compliant:** All attributes are atomic. No repeating groups.
- Qualifications stored as JSON (single field)
- Equipment_required as JSON array (single field)
- No multi-valued attributes in columns

### 5.2 Second Normal Form (2NF)
✅ **Compliant:** All non-key attributes depend on entire primary key.
- All tables have single-column PKs (surrogate keys)
- No partial dependencies

### 5.3 Third Normal Form (3NF)
✅ **Compliant:** All non-key attributes depend only on PK, not on other non-key attributes.
- age, years_of_service, duration_days = calculated fields (no storage redundancy)
- current_occupancy, current_strength, current_equipment_count = derived but stored for performance (acceptable denormalization)

### 5.4 Identified Denormalizations (Intentional for Performance)

| Field | Reason | Update Trigger |
|-------|--------|-----------------|
| soldiers.age | Frequently queried | Recalculate on read or annual batch update |
| soldiers.years_of_service | Frequently queried | Recalculate annually |
| bases.current_occupancy | Real-time query | Update on soldier assignment/removal |
| bases.current_equipment_count | Real-time query | Update on equipment assignment/removal |
| units.current_strength | Real-time query | Update on soldier assignment/removal |
| missions.duration_days | Calculated | Calculate on mission completion |

---

## 6. COMPLETE SAMPLE DATA

### 6.1 Sample Data: BASES

```json
{
  "bases": [
    {
      "base_id": "BASE-0001",
      "base_name": "Northern Command Headquarters",
      "base_code": "NCH-01",
      "location": "Chandimandir, Haryana",
      "latitude": 30.6459,
      "longitude": 76.7882,
      "base_type": "ARMY_BASE",
      "commander_id": "SOL-0001",
      "max_capacity": 5000,
      "current_occupancy": 3847,
      "max_equipment_capacity": 500,
      "current_equipment_count": 342,
      "establishment_date": "1991-01-15",
      "status": "ACTIVE",
      "region": "North-Western",
      "phone": "+91-1712-345000",
      "email": "nch.inquiries@army.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0002",
      "base_name": "Southern Naval Command",
      "base_code": "SNC-01",
      "location": "Kochi, Kerala",
      "latitude": 9.9456,
      "longitude": 76.2759,
      "base_type": "NAVAL_BASE",
      "commander_id": "SOL-0008",
      "max_capacity": 3000,
      "current_occupancy": 2156,
      "max_equipment_capacity": 300,
      "current_equipment_count": 187,
      "establishment_date": "1992-06-20",
      "status": "ACTIVE",
      "region": "Southern",
      "phone": "+91-9841-234500",
      "email": "snc.operations@navy.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0003",
      "base_name": "Eastern Air Command",
      "base_code": "EAC-01",
      "location": "Shillong, Meghalaya",
      "latitude": 25.5788,
      "longitude": 91.8933,
      "base_type": "AIR_BASE",
      "commander_id": "SOL-0015",
      "max_capacity": 2000,
      "current_occupancy": 1543,
      "max_equipment_capacity": 200,
      "current_equipment_count": 156,
      "establishment_date": "1988-03-10",
      "status": "ACTIVE",
      "region": "Eastern",
      "phone": "+91-364-123456",
      "email": "eac.command@airforce.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0004",
      "base_name": "Delta Marine Base",
      "base_code": "DMB-01",
      "location": "Vishakhapatnam, Andhra Pradesh",
      "latitude": 17.6869,
      "longitude": 83.2185,
      "base_type": "MARINE_BASE",
      "commander_id": "SOL-0022",
      "max_capacity": 2500,
      "current_occupancy": 1987,
      "max_equipment_capacity": 250,
      "current_equipment_count": 198,
      "establishment_date": "1995-08-01",
      "status": "ACTIVE",
      "region": "Southern",
      "phone": "+91-891-234567",
      "email": "dmb.support@defence.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0005",
      "base_name": "Central Training Academy",
      "base_code": "CTA-01",
      "location": "Dehradun, Uttarakhand",
      "latitude": 30.1928,
      "longitude": 78.1346,
      "base_type": "ARMY_BASE",
      "commander_id": "SOL-0029",
      "max_capacity": 3500,
      "current_occupancy": 2834,
      "max_equipment_capacity": 400,
      "current_equipment_count": 287,
      "establishment_date": "1986-05-15",
      "status": "ACTIVE",
      "region": "Central",
      "phone": "+91-135-234890",
      "email": "cta.admissions@army.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0006",
      "base_name": "Western Frontier Command",
      "base_code": "WFC-01",
      "location": "Jodhpur, Rajasthan",
      "latitude": 26.1912,
      "longitude": 73.1812,
      "base_type": "ARMY_BASE",
      "commander_id": "SOL-0036",
      "max_capacity": 4000,
      "current_occupancy": 3245,
      "max_equipment_capacity": 450,
      "current_equipment_count": 356,
      "establishment_date": "1990-11-22",
      "status": "ACTIVE",
      "region": "Western",
      "phone": "+91-291-345678",
      "email": "wfc.coordination@army.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0007",
      "base_name": "Mountain Warfare Centre",
      "base_code": "MWC-01",
      "location": "Leh, Ladakh",
      "latitude": 34.1640,
      "longitude": 77.5771,
      "base_type": "ARMY_BASE",
      "commander_id": "SOL-0043",
      "max_capacity": 1500,
      "current_occupancy": 1234,
      "max_equipment_capacity": 150,
      "current_equipment_count": 98,
      "establishment_date": "1994-02-08",
      "status": "ACTIVE",
      "region": "Northern",
      "phone": "+91-1982-245000",
      "email": "mwc.training@army.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0008",
      "base_name": "Coastal Defence Base",
      "base_code": "CDB-01",
      "location": "Goa",
      "latitude": 15.3005,
      "longitude": 73.8307,
      "base_type": "NAVAL_BASE",
      "commander_id": "SOL-0050",
      "max_capacity": 2000,
      "current_occupancy": 1567,
      "max_equipment_capacity": 200,
      "current_equipment_count": 134,
      "establishment_date": "1998-04-12",
      "status": "ACTIVE",
      "region": "Western",
      "phone": "+91-832-123456",
      "email": "cdb.operations@navy.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0009",
      "base_name": "Indira Gandhi Military Base",
      "base_code": "IGM-01",
      "location": "Bangalore, Karnataka",
      "latitude": 13.2298,
      "longitude": 77.1355,
      "base_type": "AIR_BASE",
      "commander_id": "SOL-0057",
      "max_capacity": 2500,
      "current_occupancy": 1998,
      "max_equipment_capacity": 300,
      "current_equipment_count": 234,
      "establishment_date": "1989-09-18",
      "status": "ACTIVE",
      "region": "Southern",
      "phone": "+91-80-234567",
      "email": "igm.logistics@airforce.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "base_id": "BASE-0010",
      "base_name": "Special Ops Training Centre",
      "base_code": "SOTC-01",
      "location": "Belgaum, Karnataka",
      "latitude": 15.8659,
      "longitude": 75.6244,
      "base_type": "ARMY_BASE",
      "commander_id": "SOL-0064",
      "max_capacity": 800,
      "current_occupancy": 645,
      "max_equipment_capacity": 120,
      "current_equipment_count": 87,
      "establishment_date": "2001-07-25",
      "status": "ACTIVE",
      "region": "Southern",
      "phone": "+91-831-234678",
      "email": "sotc.training@army.mil",
      "is_operational": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    }
  ]
}
```

### 6.2 Sample Data: SOLDIERS

```json
{
  "soldiers": [
    {
      "soldier_id": "SOL-0001",
      "military_id": "MIL-2001-000001",
      "first_name": "Rajendra",
      "last_name": "Singh",
      "date_of_birth": "1960-03-15",
      "age": 65,
      "gender": "MALE",
      "rank": "General",
      "specialization": "Strategic Command",
      "unit_id": "UNIT-0001",
      "base_id": "BASE-0001",
      "date_of_commission": "1982-06-10",
      "years_of_service": 43,
      "medical_status": "ACTIVE",
      "security_clearance": "TOP_SECRET",
      "contact_number": "+91-9876543210",
      "emergency_contact": "Priya Singh",
      "emergency_contact_number": "+91-9234567890",
      "address": "Officer's Residence, NCH-01, Chandimandir",
      "qualifications": ["National Defence Academy", "Staff College", "War College"],
      "performance_rating": 4.8,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0002",
      "military_id": "MIL-2001-000002",
      "first_name": "Vikram",
      "last_name": "Kumar",
      "date_of_birth": "1975-07-22",
      "age": 50,
      "gender": "MALE",
      "rank": "Colonel",
      "specialization": "Infantry Operations",
      "unit_id": "UNIT-0002",
      "base_id": "BASE-0001",
      "date_of_commission": "1996-12-01",
      "years_of_service": 29,
      "medical_status": "ACTIVE",
      "security_clearance": "SECRET",
      "contact_number": "+91-9876543211",
      "emergency_contact": "Anjali Kumar",
      "emergency_contact_number": "+91-9234567891",
      "address": "Quarters A-12, NCH-01, Chandimandir",
      "qualifications": ["Staff College", "Infantry School"],
      "performance_rating": 4.5,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0003",
      "military_id": "MIL-2001-000003",
      "first_name": "Arjun",
      "last_name": "Patel",
      "date_of_birth": "1988-11-08",
      "age": 37,
      "gender": "MALE",
      "rank": "Major",
      "specialization": "Combat Operations",
      "unit_id": "UNIT-0002",
      "base_id": "BASE-0001",
      "date_of_commission": "2005-07-15",
      "years_of_service": 20,
      "medical_status": "ACTIVE",
      "security_clearance": "LEVEL_2",
      "contact_number": "+91-9876543212",
      "emergency_contact": "Sneha Patel",
      "emergency_contact_number": "+91-9234567892",
      "address": "Quarters B-45, NCH-01, Chandimandir",
      "qualifications": ["Advanced Officers Course", "Tactics Training"],
      "performance_rating": 4.3,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0004",
      "military_id": "MIL-2001-000004",
      "first_name": "Ravi",
      "last_name": "Verma",
      "date_of_birth": "1992-02-14",
      "age": 33,
      "gender": "MALE",
      "rank": "Captain",
      "specialization": "Tactical Planning",
      "unit_id": "UNIT-0002",
      "base_id": "BASE-0001",
      "date_of_commission": "2010-12-20",
      "years_of_service": 15,
      "medical_status": "ACTIVE",
      "security_clearance": "LEVEL_1",
      "contact_number": "+91-9876543213",
      "emergency_contact": "Divya Verma",
      "emergency_contact_number": "+91-9234567893",
      "address": "Quarters C-78, NCH-01, Chandimandir",
      "qualifications": ["Junior Officers Course", "Commando Training"],
      "performance_rating": 4.1,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0005",
      "military_id": "MIL-2001-000005",
      "first_name": "Deepak",
      "last_name": "Sharma",
      "date_of_birth": "1995-05-30",
      "age": 30,
      "gender": "MALE",
      "rank": "Lieutenant",
      "specialization": "Field Communications",
      "unit_id": "UNIT-0002",
      "base_id": "BASE-0001",
      "date_of_commission": "2015-06-15",
      "years_of_service": 10,
      "medical_status": "ACTIVE",
      "security_clearance": "LEVEL_1",
      "contact_number": "+91-9876543214",
      "emergency_contact": "Kavya Sharma",
      "emergency_contact_number": "+91-9234567894",
      "address": "Quarters D-23, NCH-01, Chandimandir",
      "qualifications": ["Communication Systems", "Signal Corps Training"],
      "performance_rating": 3.9,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0006",
      "military_id": "MIL-2001-000006",
      "first_name": "Pradeep",
      "last_name": "Singh",
      "date_of_birth": "1998-09-10",
      "age": 27,
      "gender": "MALE",
      "rank": "Sepoy",
      "specialization": "Machine Gunner",
      "unit_id": "UNIT-0002",
      "base_id": "BASE-0001",
      "date_of_commission": "2018-01-08",
      "years_of_service": 7,
      "medical_status": "ACTIVE",
      "security_clearance": "LEVEL_1",
      "contact_number": "+91-9876543215",
      "emergency_contact": "Meena Singh",
      "emergency_contact_number": "+91-9234567895",
      "address": "Barracks Block-A, NCH-01, Chandimandir",
      "qualifications": ["Basic Infantry Training", "Weapons Proficiency"],
      "performance_rating": 3.7,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0008",
      "military_id": "MIL-2001-000008",
      "first_name": "Prakash",
      "last_name": "Desai",
      "date_of_birth": "1962-01-20",
      "age": 64,
      "gender": "MALE",
      "rank": "Admiral",
      "specialization": "Naval Operations",
      "unit_id": "UNIT-0003",
      "base_id": "BASE-0002",
      "date_of_commission": "1980-07-01",
      "years_of_service": 45,
      "medical_status": "ACTIVE",
      "security_clearance": "TOP_SECRET",
      "contact_number": "+91-9876543217",
      "emergency_contact": "Sunita Desai",
      "emergency_contact_number": "+91-9234567897",
      "address": "Officer's Residence, SNC-01, Kochi",
      "qualifications": ["Naval Staff College", "Sea Command Course"],
      "performance_rating": 4.8,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0015",
      "military_id": "MIL-2001-000015",
      "first_name": "Harpreet",
      "last_name": "Kaur",
      "date_of_birth": "1968-04-12",
      "age": 57,
      "gender": "FEMALE",
      "rank": "Air Marshal",
      "specialization": "Fighter Operations",
      "unit_id": "UNIT-0004",
      "base_id": "BASE-0003",
      "date_of_commission": "1985-12-15",
      "years_of_service": 40,
      "medical_status": "ACTIVE",
      "security_clearance": "TOP_SECRET",
      "contact_number": "+91-9876543224",
      "emergency_contact": "Simran Kaur",
      "emergency_contact_number": "+91-9234567904",
      "address": "Officer's Residence, EAC-01, Shillong",
      "qualifications": ["Fighter Pilot Training", "Command Staff College"],
      "performance_rating": 4.7,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0022",
      "military_id": "MIL-2001-000022",
      "first_name": "Suresh",
      "last_name": "Nair",
      "date_of_birth": "1965-08-25",
      "age": 60,
      "gender": "MALE",
      "rank": "Vice Admiral",
      "specialization": "Marine Operations",
      "unit_id": "UNIT-0005",
      "base_id": "BASE-0004",
      "date_of_commission": "1983-06-20",
      "years_of_service": 42,
      "medical_status": "ACTIVE",
      "security_clearance": "TOP_SECRET",
      "contact_number": "+91-9876543231",
      "emergency_contact": "Lakshmi Nair",
      "emergency_contact_number": "+91-9234567911",
      "address": "Officer's Residence, DMB-01, Vishakhapatnam",
      "qualifications": ["Naval Command", "Operations Planning"],
      "performance_rating": 4.6,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "soldier_id": "SOL-0029",
      "military_id": "MIL-2001-000029",
      "first_name": "Ashok",
      "last_name": "Menon",
      "date_of_birth": "1963-12-03",
      "age": 62,
      "gender": "MALE",
      "rank": "Lieutenant General",
      "specialization": "Military Education",
      "unit_id": "UNIT-0006",
      "base_id": "BASE-0005",
      "date_of_commission": "1981-05-10",
      "years_of_service": 44,
      "medical_status": "ACTIVE",
      "security_clearance": "TOP_SECRET",
      "contact_number": "+91-9876543238",
      "emergency_contact": "Vimala Menon",
      "emergency_contact_number": "+91-9234567918",
      "address": "Principal's Residence, CTA-01, Dehradun",
      "qualifications": ["Staff College", "Training Director Certification"],
      "performance_rating": 4.7,
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    }
  ]
}
```

### 6.3 Sample Data: UNITS

```json
{
  "units": [
    {
      "unit_id": "UNIT-0001",
      "unit_name": "Northern Command Headquarters",
      "unit_code": "NCHQ-01",
      "unit_type": "SUPPORT",
      "commander_id": "SOL-0001",
      "deputy_commander_id": "SOL-0002",
      "base_id": "BASE-0001",
      "authorized_strength": 500,
      "current_strength": 487,
      "specialized_equipment": "Command and Control Systems, Satellite Communication",
      "formation_date": "1991-01-15",
      "operational_area": "North-Western Command Zone",
      "battle_honors": "Op Vijay, Op Meghdoot",
      "motto": "Bharat Ki Raksha",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0002",
      "unit_name": "7th Infantry Brigade",
      "unit_code": "INF-7-01",
      "unit_type": "INFANTRY",
      "commander_id": "SOL-0002",
      "deputy_commander_id": "SOL-0003",
      "base_id": "BASE-0001",
      "authorized_strength": 800,
      "current_strength": 756,
      "specialized_equipment": "Assault Rifles, Machine Guns, Mortars, IFVs",
      "formation_date": "1988-03-20",
      "operational_area": "Northern Highlands",
      "battle_honors": "Op Parakram, Op Meghdoot",
      "motto": "Shura Vijeyta",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0003",
      "unit_name": "Eastern Naval Squadron",
      "unit_code": "NAV-ES-01",
      "unit_type": "LOGISTICS",
      "commander_id": "SOL-0008",
      "deputy_commander_id": null,
      "base_id": "BASE-0002",
      "authorized_strength": 450,
      "current_strength": 412,
      "specialized_equipment": "Naval Destroyers, Frigates, Supply Ships",
      "formation_date": "1992-06-15",
      "operational_area": "Eastern Indian Ocean",
      "battle_honors": "Op Triumph, Op Guardian",
      "motto": "Jal Raksha",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0004",
      "unit_name": "12th Fighter Squadron",
      "unit_code": "AIR-12-01",
      "unit_type": "SPECIAL_FORCES",
      "commander_id": "SOL-0015",
      "deputy_commander_id": null,
      "base_id": "BASE-0003",
      "authorized_strength": 300,
      "current_strength": 287,
      "specialized_equipment": "Fighter Jets (Tejas), Combat Helicopters",
      "formation_date": "1989-08-10",
      "operational_area": "Northern Airspace",
      "battle_honors": "Op Swift Strike, Op Blue Skies",
      "motto": "Akash Jai",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0005",
      "unit_name": "Marine Commando Battalion",
      "unit_code": "MCDO-01",
      "unit_type": "SPECIAL_FORCES",
      "commander_id": "SOL-0022",
      "deputy_commander_id": null,
      "base_id": "BASE-0004",
      "authorized_strength": 350,
      "current_strength": 334,
      "specialized_equipment": "Amphibious Armored Vehicles, Assault Boats, Diving Equipment",
      "formation_date": "1995-04-01",
      "operational_area": "Coastal Regions",
      "battle_honors": "Op Triumph",
      "motto": "Dar Aao Samunder Se",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0006",
      "unit_name": "Officer Training Academy",
      "unit_code": "OTA-01",
      "unit_type": "SUPPORT",
      "commander_id": "SOL-0029",
      "deputy_commander_id": null,
      "base_id": "BASE-0005",
      "authorized_strength": 600,
      "current_strength": 568,
      "specialized_equipment": "Training Equipment, Simulation Systems",
      "formation_date": "1986-05-15",
      "operational_area": "Training Center",
      "battle_honors": "Educational Excellence",
      "motto": "Niti Vidya Nayate Jayam",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0007",
      "unit_name": "13th Armored Regiment",
      "unit_code": "ARM-13-01",
      "unit_type": "ARMOR",
      "commander_id": "SOL-0003",
      "deputy_commander_id": null,
      "base_id": "BASE-0006",
      "authorized_strength": 650,
      "current_strength": 598,
      "specialized_equipment": "Main Battle Tanks (T-90), Support Vehicles",
      "formation_date": "1990-11-22",
      "operational_area": "Western Frontier",
      "battle_honors": "Op Safed Sagar, Op Desert Storm",
      "motto": "Garjat Tejo Vardhate",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0008",
      "unit_name": "Mountain Warfare Unit",
      "unit_code": "MW-01",
      "unit_type": "INFANTRY",
      "commander_id": "SOL-0004",
      "deputy_commander_id": null,
      "base_id": "BASE-0007",
      "authorized_strength": 400,
      "current_strength": 367,
      "specialized_equipment": "Mountain Assault Rifles, Climbing Equipment, Cold Weather Gear",
      "formation_date": "1994-02-08",
      "operational_area": "High Altitude Mountain Regions",
      "battle_honors": "Op Vijay, Op High Peak",
      "motto": "Parvat Jai",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0009",
      "unit_name": "Coastal Defence Squadron",
      "unit_code": "CD-01",
      "unit_type": "LOGISTICS",
      "commander_id": "SOL-0050",
      "deputy_commander_id": null,
      "base_id": "BASE-0008",
      "authorized_strength": 320,
      "current_strength": 298,
      "specialized_equipment": "Patrol Vessels, Radar Systems, Missile Launchers",
      "formation_date": "1998-04-12",
      "operational_area": "Western Coastal Zone",
      "battle_honors": "Op Coast Guard",
      "motto": "Sagara Raksha",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "unit_id": "UNIT-0010",
      "unit_name": "Transport and Supply Unit",
      "unit_code": "TSU-01",
      "unit_type": "LOGISTICS",
      "commander_id": "SOL-0057",
      "deputy_commander_id": null,
      "base_id": "BASE-0009",
      "authorized_strength": 280,
      "current_strength": 256,
      "specialized_equipment": "Transport Vehicles, Cargo Helicopters, Supply Depots",
      "formation_date": "1989-09-18",
      "operational_area": "Southern Supply Chain",
      "battle_honors": "Op Lifeline",
      "motto": "Seva Vrata",
      "status": "ACTIVE",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    }
  ]
}
```

### 6.4 Sample Data: EQUIPMENT

```json
{
  "equipment": [
    {
      "equipment_id": "EQP-0001",
      "equipment_code": "INSAS-001",
      "equipment_name": "INSAS Rifle",
      "equipment_type": "Assault Rifle",
      "equipment_category": "WEAPON",
      "manufacturer": "Ordnance Factory, Kanpur",
      "model": "INSAS 5.56mm",
      "serial_number": "INS-2018-0001",
      "manufacture_date": "2018-05-10",
      "acquisition_date": "2018-08-20",
      "acquisition_cost": 45000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0002",
      "assigned_to_soldier_id": "SOL-0006",
      "status": "IN_USE",
      "condition": "GOOD",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-01-15",
      "next_maintenance_due": "2026-12-15",
      "maintenance_cost": 2500.00,
      "operational_hours": 1250,
      "location_details": "Armory Block-A, Rack-12",
      "is_tracked": false,
      "warranty_expiry_date": "2028-05-10",
      "documentation": {"manual": "INSAS_Manual_v2.pdf", "specs": "INSAS_Specs.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0002",
      "equipment_code": "T90-TANK-001",
      "equipment_name": "T-90 Main Battle Tank",
      "equipment_type": "Main Battle Tank",
      "equipment_category": "VEHICLE",
      "manufacturer": "Russia (Licensed)", "model": "T-90AM",
      "serial_number": "T90-2015-0001",
      "manufacture_date": "2015-03-20",
      "acquisition_date": "2015-09-10",
      "acquisition_cost": 45000000.00,
      "base_id": "BASE-0006",
      "unit_id": "UNIT-0007",
      "assigned_to_soldier_id": null,
      "status": "OPERATIONAL",
      "condition": "EXCELLENT",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-02-01",
      "next_maintenance_due": "2026-08-01",
      "maintenance_cost": 500000.00,
      "operational_hours": 8750,
      "location_details": "Tank Park-B, Position-05",
      "is_tracked": true,
      "warranty_expiry_date": null,
      "documentation": {"manual": "T90_Manual_Russian.pdf", "specs": "T90_Specifications.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0003",
      "equipment_code": "COMM-SET-001",
      "equipment_name": "Portable Radio Communication Set",
      "equipment_type": "Radio Set",
      "equipment_category": "COMMUNICATION",
      "manufacturer": "Bharat Electronics Limited",
      "model": "BEL-RT-2000",
      "serial_number": "BEL-RT-2000-0001",
      "manufacture_date": "2019-06-15",
      "acquisition_date": "2019-09-05",
      "acquisition_cost": 350000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0001",
      "assigned_to_soldier_id": "SOL-0005",
      "status": "OPERATIONAL",
      "condition": "GOOD",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-01-20",
      "next_maintenance_due": "2026-07-20",
      "maintenance_cost": 15000.00,
      "operational_hours": 450,
      "location_details": "Communication Room-A, Cabinet-03",
      "is_tracked": false,
      "warranty_expiry_date": "2027-06-15",
      "documentation": {"manual": "BEL_RT_2000_Manual.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0004",
      "equipment_code": "HUMVEE-001",
      "equipment_name": "HMMWV (Humvee)",
      "equipment_type": "Light Vehicle",
      "equipment_category": "VEHICLE",
      "manufacturer": "AM General",
      "model": "HMMWV M1151",
      "serial_number": "AM-2016-0001",
      "manufacture_date": "2016-02-10",
      "acquisition_date": "2016-05-20",
      "acquisition_cost": 8500000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0002",
      "assigned_to_soldier_id": null,
      "status": "OPERATIONAL",
      "condition": "GOOD",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-01-30",
      "next_maintenance_due": "2026-07-30",
      "maintenance_cost": 75000.00,
      "operational_hours": 3500,
      "location_details": "Motor Pool-C, Bay-07",
      "is_tracked": true,
      "warranty_expiry_date": null,
      "documentation": {"manual": "HMMWV_Manual.pdf", "specs": "HMMWV_Specs.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0005",
      "equipment_code": "MISSILE-001",
      "equipment_name": "BrahMos Missile System",
      "equipment_type": "Missile Launcher",
      "equipment_category": "WEAPON",
      "manufacturer": "BrahMos Aerospace",
      "model": "BrahMos I",
      "serial_number": "BrahMos-2017-0001",
      "manufacture_date": "2017-11-05",
      "acquisition_date": "2017-12-15",
      "acquisition_cost": 450000000.00,
      "base_id": "BASE-0003",
      "unit_id": "UNIT-0004",
      "assigned_to_soldier_id": null,
      "status": "STORED",
      "condition": "EXCELLENT",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2025-11-10",
      "next_maintenance_due": "2026-11-10",
      "maintenance_cost": 5000000.00,
      "operational_hours": 0,
      "location_details": "Secure Storage Bunker-A",
      "is_tracked": true,
      "warranty_expiry_date": null,
      "documentation": {"manual": "BrahMos_Manual_Classified.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0006",
      "equipment_code": "AK47-002",
      "equipment_name": "AK-47 Rifle",
      "equipment_type": "Assault Rifle",
      "equipment_category": "WEAPON",
      "manufacturer": "Kalashnikov",
      "model": "AK-47 7.62mm",
      "serial_number": "AK47-2012-0002",
      "manufacture_date": "2012-08-22",
      "acquisition_date": "2013-01-10",
      "acquisition_cost": 35000.00,
      "base_id": "BASE-0001",
      "unit_id": null,
      "assigned_to_soldier_id": null,
      "status": "STORED",
      "condition": "FAIR",
      "maintenance_status": "NEEDS_MAINTENANCE",
      "last_maintenance_date": "2025-06-15",
      "next_maintenance_due": "2026-03-15",
      "maintenance_cost": 3000.00,
      "operational_hours": 890,
      "location_details": "Armory Block-B, Rack-45",
      "is_tracked": false,
      "warranty_expiry_date": null,
      "documentation": {"manual": "AK47_Manual.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0007",
      "equipment_code": "TEJAS-001",
      "equipment_name": "HAL Tejas Fighter Aircraft",
      "equipment_type": "Fighter Aircraft",
      "equipment_category": "VEHICLE",
      "manufacturer": "Hindustan Aeronautics Limited",
      "model": "Tejas Mk1A",
      "serial_number": "HAL-Tejas-2019-0001",
      "manufacture_date": "2019-04-15",
      "acquisition_date": "2019-07-20",
      "acquisition_cost": 125000000.00,
      "base_id": "BASE-0003",
      "unit_id": "UNIT-0004",
      "assigned_to_soldier_id": null,
      "status": "OPERATIONAL",
      "condition": "EXCELLENT",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-02-10",
      "next_maintenance_due": "2026-08-10",
      "maintenance_cost": 2500000.00,
      "operational_hours": 420,
      "location_details": "Hangar-01, Parking Spot-03",
      "is_tracked": true,
      "warranty_expiry_date": null,
      "documentation": {"manual": "Tejas_Pilot_Manual.pdf", "specs": "Tejas_Technical_Specs.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0008",
      "equipment_code": "AMMO-556-BULK",
      "equipment_name": "5.56mm Ammunition (Bulk)",
      "equipment_type": "Ammunition (5.56mm)",
      "equipment_category": "WEAPON",
      "manufacturer": "Ordnance Factory, Itarsi",
      "model": "Std NATO 5.56x45",
      "serial_number": "AMMO-2020-0001",
      "manufacture_date": "2020-09-01",
      "acquisition_date": "2020-11-15",
      "acquisition_cost": 12000000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0002",
      "assigned_to_soldier_id": null,
      "status": "STORED",
      "condition": "EXCELLENT",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": null,
      "next_maintenance_due": null,
      "maintenance_cost": 0.00,
      "operational_hours": 0,
      "location_details": "Ammunition Magazine-C, Section-05",
      "is_tracked": false,
      "warranty_expiry_date": null,
      "documentation": {"specs": "NATO_556_Specifications.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0009",
      "equipment_code": "SNIPER-001",
      "equipment_name": "SSG 69 Sniper Rifle",
      "equipment_type": "Sniper Rifle",
      "equipment_category": "WEAPON",
      "manufacturer": "Steyr Mannlicher",
      "model": "SSG 69 Precision",
      "serial_number": "SSG-2014-0001",
      "manufacture_date": "2014-07-08",
      "acquisition_date": "2014-10-25",
      "acquisition_cost": 280000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0002",
      "assigned_to_soldier_id": null,
      "status": "OPERATIONAL",
      "condition": "EXCELLENT",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-01-05",
      "next_maintenance_due": "2026-07-05",
      "maintenance_cost": 8000.00,
      "operational_hours": 320,
      "location_details": "Armory Block-A, Specialized Weapons Cabinet",
      "is_tracked": false,
      "warranty_expiry_date": null,
      "documentation": {"manual": "SSG69_Manual.pdf", "specs": "SSG69_Specs.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "equipment_id": "EQP-0010",
      "equipment_code": "MEDKIT-FIELD-001",
      "equipment_name": "Field Medical Kit",
      "equipment_type": "Field Hospital Equipment",
      "equipment_category": "MEDICAL",
      "manufacturer": "Medical Supplies Ltd",
      "model": "Portable Field Kit v3.0",
      "serial_number": "MED-2021-0001",
      "manufacture_date": "2021-03-12",
      "acquisition_date": "2021-05-20",
      "acquisition_cost": 150000.00,
      "base_id": "BASE-0001",
      "unit_id": "UNIT-0002",
      "assigned_to_soldier_id": null,
      "status": "STORED",
      "condition": "GOOD",
      "maintenance_status": "OPERATIONAL",
      "last_maintenance_date": "2026-01-10",
      "next_maintenance_due": "2026-07-10",
      "maintenance_cost": 5000.00,
      "operational_hours": 0,
      "location_details": "Medical Stores Room-02, Cabinet-A",
      "is_tracked": false,
      "warranty_expiry_date": "2028-03-12",
      "documentation": {"manual": "FieldKit_Manual.pdf", "inventory": "FieldKit_Inventory.pdf"},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    }
  ]
}
```

### 6.5 Sample Data: MISSIONS

```json
{
  "missions": [
    {
      "mission_id": "MIS-0001",
      "mission_code": "OP-ALPHA-001",
      "mission_name": "Border Patrol - Northern Sector",
      "mission_type": "PATROL",
      "mission_classification": "CONFIDENTIAL",
      "unit_id": "UNIT-0002",
      "commander_id": "SOL-0002",
      "base_id": "BASE-0001",
      "objective": "Conduct routine patrol along Siachen Glacier border to detect unauthorized movement and maintain territorial presence",
      "target_location": "Siachen Glacier, Northern Border",
      "target_latitude": 35.5047,
      "target_longitude": 77.3640,
      "scheduled_start_date": "2026-02-20",
      "scheduled_end_date": "2026-03-15",
      "actual_start_date": "2026-02-20",
      "actual_end_date": null,
      "duration_days": 24,
      "estimated_personnel_required": 45,
      "actual_personnel_assigned": 45,
      "equipment_required": ["INSAS-001", "HUMVEE-001", "COMM-SET-001"],
      "priority": "HIGH",
      "status": "ACTIVE",
      "risk_level": "HIGH",
      "casualties_count": 0,
      "mission_cost_estimate": 2500000.00,
      "actual_mission_cost": 1875000.00,
      "outcome": null,
      "notes": "Ongoing patrol with adverse weather conditions. All personnel accounted for. Equipment functioning normally.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0002",
      "mission_code": "OP-RESCUE-001",
      "mission_name": "Mountain Rescue Operation",
      "mission_type": "RESCUE",
      "mission_classification": "UNCLASSIFIED",
      "unit_id": "UNIT-0008",
      "commander_id": "SOL-0004",
      "base_id": "BASE-0007",
      "objective": "Rescue civilian mountaineering expedition stranded due to avalanche",
      "target_location": "Khardung La Pass, Ladakh",
      "target_latitude": 34.2674,
      "target_longitude": 77.5770,
      "scheduled_start_date": "2026-02-15",
      "scheduled_end_date": "2026-02-18",
      "actual_start_date": "2026-02-15",
      "actual_end_date": "2026-02-17",
      "duration_days": 3,
      "estimated_personnel_required": 30,
      "actual_personnel_assigned": 32,
      "equipment_required": ["MW-01", "Helicopter Support", "Medical Equipment"],
      "priority": "CRITICAL",
      "status": "COMPLETED",
      "risk_level": "CRITICAL",
      "casualties_count": 0,
      "mission_cost_estimate": 1500000.00,
      "actual_mission_cost": 1420000.00,
      "outcome": "SUCCESS",
      "notes": "Successfully rescued 18 civilians. All safe. Mission completed ahead of schedule.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0003",
      "mission_code": "OP-STRIKE-001",
      "mission_name": "Counter-Terrorism Operation",
      "mission_type": "COMBAT",
      "mission_classification": "SECRET",
      "unit_id": "UNIT-0004",
      "commander_id": "SOL-0015",
      "base_id": "BASE-0003",
      "objective": "Conduct aerial strikes on identified militant positions in remote region",
      "target_location": "Northern Remote Sector, Coordinates Restricted",
      "target_latitude": null,
      "target_longitude": null,
      "scheduled_start_date": "2026-03-01",
      "scheduled_end_date": "2026-03-05",
      "actual_start_date": null,
      "actual_end_date": null,
      "duration_days": 5,
      "estimated_personnel_required": 60,
      "actual_personnel_assigned": 0,
      "equipment_required": ["TEJAS-001", "Combat Helicopters", "BrahMos System"],
      "priority": "CRITICAL",
      "status": "AUTHORIZED",
      "risk_level": "CRITICAL",
      "casualties_count": 0,
      "mission_cost_estimate": 15000000.00,
      "actual_mission_cost": null,
      "outcome": null,
      "notes": "Awaiting final authorization. All equipment and personnel on standby.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0004",
      "mission_code": "OP-TRANSPORT-001",
      "mission_name": "Strategic Supply Transport",
      "mission_type": "TRANSPORT",
      "mission_classification": "CONFIDENTIAL",
      "unit_id": "UNIT-0010",
      "commander_id": "SOL-0057",
      "base_id": "BASE-0009",
      "objective": "Transport strategic supplies and equipment to forward operating bases",
      "target_location": "Southern Forward Bases Network",
      "target_latitude": 13.0827,
      "target_longitude": 80.2707,
      "scheduled_start_date": "2026-02-18",
      "scheduled_end_date": "2026-02-25",
      "actual_start_date": "2026-02-18",
      "actual_end_date": null,
      "duration_days": 8,
      "estimated_personnel_required": 25,
      "actual_personnel_assigned": 24,
      "equipment_required": ["TSU-Transport-Vehicles", "Cargo Helicopters", "HUMVEE-001"],
      "priority": "MEDIUM",
      "status": "ACTIVE",
      "risk_level": "MEDIUM",
      "casualties_count": 0,
      "mission_cost_estimate": 3500000.00,
      "actual_mission_cost": 2100000.00,
      "outcome": null,
      "notes": "Transport running on schedule. Supplies delivered to Base Alpha and Beta. En route to Base Charlie.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0005",
      "mission_code": "OP-BLOCKADE-001",
      "mission_name": "Naval Blockade Operation",
      "mission_type": "SURVEILLANCE",
      "mission_classification": "SECRET",
      "unit_id": "UNIT-0003",
      "commander_id": "SOL-0008",
      "base_id": "BASE-0002",
      "objective": "Maintain naval surveillance and prevent unauthorized maritime activities in Eastern waters",
      "target_location": "Eastern Exclusive Economic Zone",
      "target_latitude": 10.5,
      "target_longitude": 89.0,
      "scheduled_start_date": "2026-01-15",
      "scheduled_end_date": "2026-06-30",
      "actual_start_date": "2026-01-15",
      "actual_end_date": null,
      "duration_days": 167,
      "estimated_personnel_required": 150,
      "actual_personnel_assigned": 148,
      "equipment_required": ["Naval Destroyers", "Patrol Vessels", "Radar Systems"],
      "priority": "HIGH",
      "status": "ACTIVE",
      "risk_level": "MEDIUM",
      "casualties_count": 0,
      "mission_cost_estimate": 45000000.00,
      "actual_mission_cost": 28500000.00,
      "outcome": null,
      "notes": "Ongoing operation. 3 unauthorized vessels detected and turned back. All naval units operational.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0006",
      "mission_code": "OP-TRAINING-001",
      "mission_name": "Combat Readiness Training Exercise",
      "mission_type": "TRAINING",
      "mission_classification": "UNCLASSIFIED",
      "unit_id": "UNIT-0006",
      "commander_id": "SOL-0029",
      "base_id": "BASE-0005",
      "objective": "Conduct comprehensive military training to enhance combat readiness and tactics",
      "target_location": "Training Grounds, Dehradun",
      "target_latitude": 30.1928,
      "target_longitude": 78.1346,
      "scheduled_start_date": "2026-02-10",
      "scheduled_end_date": "2026-02-28",
      "actual_start_date": "2026-02-10",
      "actual_end_date": null,
      "duration_days": 19,
      "estimated_personnel_required": 200,
      "actual_personnel_assigned": 198,
      "equipment_required": ["Training Equipment", "Simulation Systems", "Vehicles"],
      "priority": "MEDIUM",
      "status": "ACTIVE",
      "risk_level": "LOW",
      "casualties_count": 2,
      "mission_cost_estimate": 5000000.00,
      "actual_mission_cost": 4200000.00,
      "outcome": null,
      "notes": "Training progressing well. 2 minor injuries reported (non-serious). All equipment performing as expected.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0007",
      "mission_code": "OP-MEDEVAC-001",
      "mission_name": "Emergency Medical Evacuation",
      "mission_type": "RESCUE",
      "mission_classification": "CONFIDENTIAL",
      "unit_id": "UNIT-0005",
      "commander_id": "SOL-0022",
      "base_id": "BASE-0004",
      "objective": "Perform emergency medical evacuation for critically injured personnel from coastal region",
      "target_location": "Coastal Marine Operations Zone",
      "target_latitude": 17.6869,
      "target_longitude": 83.2185,
      "scheduled_start_date": "2026-02-16",
      "scheduled_end_date": "2026-02-16",
      "actual_start_date": "2026-02-16",
      "actual_end_date": "2026-02-16",
      "duration_days": 1,
      "estimated_personnel_required": 15,
      "actual_personnel_assigned": 15,
      "equipment_required": ["Ambulance", "Medical Equipment", "Helicopter"],
      "priority": "CRITICAL",
      "status": "COMPLETED",
      "risk_level": "HIGH",
      "casualties_count": 0,
      "mission_cost_estimate": 800000.00,
      "actual_mission_cost": 650000.00,
      "outcome": "SUCCESS",
      "notes": "Patient successfully evacuated and transferred to military hospital. Condition stable.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0008",
      "mission_code": "OP-SHOWCASE-001",
      "mission_name": "Republic Day Aerial Display",
      "mission_type": "TRAINING",
      "mission_classification": "UNCLASSIFIED",
      "unit_id": "UNIT-0004",
      "commander_id": "SOL-0015",
      "base_id": "BASE-0003",
      "objective": "Conduct aerial display demonstrations for Republic Day national celebrations",
      "target_location": "New Delhi Sky, India Gate",
      "target_latitude": 28.6139,
      "target_longitude": 77.1811,
      "scheduled_start_date": "2026-01-26",
      "scheduled_end_date": "2026-01-26",
      "actual_start_date": "2026-01-26",
      "actual_end_date": "2026-01-26",
      "duration_days": 1,
      "estimated_personnel_required": 20,
      "actual_personnel_assigned": 20,
      "equipment_required": ["TEJAS-001", "Combat Helicopters", "Transport Aircraft"],
      "priority": "MEDIUM",
      "status": "COMPLETED",
      "risk_level": "LOW",
      "casualties_count": 0,
      "mission_cost_estimate": 2000000.00,
      "actual_mission_cost": 1950000.00,
      "outcome": "SUCCESS",
      "notes": "Successful display viewed by over 5 million spectators. No incidents reported.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0009",
      "mission_code": "OP-ARMOUR-001",
      "mission_name": "Armored Division Deployment",
      "mission_type": "COMBAT",
      "mission_classification": "CONFIDENTIAL",
      "unit_id": "UNIT-0007",
      "commander_id": "SOL-0003",
      "base_id": "BASE-0006",
      "objective": "Deploy armored division to forward positions for territorial defense and strategic positioning",
      "target_location": "Western Frontier Strategic Zone",
      "target_latitude": 26.5124,
      "target_longitude": 73.0824,
      "scheduled_start_date": "2026-03-01",
      "scheduled_end_date": "2026-04-30",
      "actual_start_date": null,
      "actual_end_date": null,
      "duration_days": 61,
      "estimated_personnel_required": 500,
      "actual_personnel_assigned": 0,
      "equipment_required": ["T90-TANK-001", "Support Vehicles", "Artillery"],
      "priority": "HIGH",
      "status": "SCHEDULED",
      "risk_level": "MEDIUM",
      "casualties_count": 0,
      "mission_cost_estimate": 25000000.00,
      "actual_mission_cost": null,
      "outcome": null,
      "notes": "Deployment scheduled for March 1st. Equipment undergoing final inspection.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    },
    {
      "mission_id": "MIS-0010",
      "mission_code": "OP-DISASTER-001",
      "mission_name": "Disaster Relief Operation",
      "mission_type": "SUPPORT",
      "mission_classification": "UNCLASSIFIED",
      "unit_id": "UNIT-0010",
      "commander_id": "SOL-0057",
      "base_id": "BASE-0009",
      "objective": "Provide humanitarian assistance and relief supplies to flood-affected regions",
      "target_location": "Southern Flood-Affected States",
      "target_latitude": 15.3005,
      "target_longitude": 73.8307,
      "scheduled_start_date": "2026-02-14",
      "scheduled_end_date": "2026-02-21",
      "actual_start_date": "2026-02-14",
      "actual_end_date": "2026-02-21",
      "duration_days": 8,
      "estimated_personnel_required": 100,
      "actual_personnel_assigned": 102,
      "equipment_required": ["Transport Vehicles", "Medical Equipment", "Food Supplies"],
      "priority": "HIGH",
      "status": "COMPLETED",
      "risk_level": "LOW",
      "casualties_count": 0,
      "mission_cost_estimate": 8000000.00,
      "actual_mission_cost": 7200000.00,
      "outcome": "SUCCESS",
      "notes": "Successfully delivered supplies to 45 villages. 5000+ people aided. No complications.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2026-02-17T14:00:00Z"
    }
  ]
}
```

---

## 7. SUMMARY STATISTICS

### Data Model Overview

| Entity | Total Records | Key Fields | Primary Key Type |
|--------|---------------|-----------|------------------|
| BASES | 10 | 23 | UUID |
| SOLDIERS | 20+ | 28 | UUID |
| UNITS | 10 | 18 | UUID |
| EQUIPMENT | 10 | 28 | UUID |
| MISSIONS | 10 | 31 | UUID |

### Relationships
- **Total 1:M Relationships:** 12
- **Total FK Constraints:** 15
- **Nullable FK Fields:** 3

### Database Complexity
- **Normalization Level:** 3NF
- **Intentional Denormalizations:** 6 (performance-optimized)
- **Business Rules:** 26
- **Constraints:** Multi-level validation

---

## 8. IMPLEMENTATION NOTES FOR DIFFERENT TECH STACKS

### For SQL Databases (PostgreSQL, MySQL, SQL Server):
```sql
-- Create tables with similar structure
-- Use ENUM types for standardized values
-- Implement CHECK constraints for business rules
-- Use triggers for calculated fields
-- Foreign key constraints with CASCADE options
```

### For NoSQL (MongoDB, Firebase):
```javascript
// Store as document collections
// Embed frequently accessed related data
// Use arrays for child records
// Maintain denormalized copies for performance
// Implement application-level transaction logic
```

### For Graph Databases (Neo4j):
```cypher
// Define nodes for each entity
// Create relationships between entities
// Use relationship properties for constraints
// Traverse relationships for complex queries
```

### For Data Warehousing (Snowflake, BigQuery):
```sql
-- Create fact and dimension tables
-- Implement slowly changing dimensions
-- Use surrogate keys
-- Aggregate fact tables for performance
```

---

## CONCLUSION

This data model provides:

✅ **Complete Structure:** All core military entities with comprehensive attributes  
✅ **Normalization:** 3NF compliance with intentional performance optimizations  
✅ **Relationships:** 12 well-defined relationships covering all use cases  
✅ **Business Rules:** 26 constraints ensuring data integrity  
✅ **Sample Data:** 40+ realistic records across all entities  
✅ **Flexibility:** Tech-stack independent design  
✅ **Scalability:** Ready for production enterprise system  

The model is ready for implementation in any technology stack while maintaining data integrity and business logic consistency.

