from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from maintenance.models import (
    Company, Vendor, Department, Employee, WorkCenter,
    MaintenanceTeam, EquipmentCategory, Equipment,
    MaintenanceRequest, MaintenanceLog, ScheduledMaintenance
)


class Command(BaseCommand):
    help = 'Populates the database with demo data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting to populate database with demo data...'))

        # Create demo users
        users = self.create_users()
        
        # Create demo companies
        companies = self.create_companies()
        
        # Create demo vendors
        vendors = self.create_vendors()
        
        # Create demo departments
        departments = self.create_departments(companies[0])
        
        # Create demo employees
        employees = self.create_employees(companies[0], departments, users)
        
        # Create demo work centers
        workcenters = self.create_workcenters(companies[0])
        
        # Create demo maintenance teams
        teams = self.create_teams(companies[0], employees)
        
        # Create demo equipment categories
        categories = self.create_categories()
        
        # Create demo equipment
        equipment_list = self.create_equipment(companies[0], workcenters, categories, vendors)
        
        # Create demo maintenance requests
        requests = self.create_maintenance_requests(equipment_list, employees, teams)
        
        # Create demo maintenance logs
        self.create_maintenance_logs(requests, employees)
        
        # Create demo scheduled maintenance
        self.create_scheduled_maintenance(equipment_list, teams)

        self.stdout.write(self.style.SUCCESS('Successfully populated database with demo data!'))

    def create_users(self):
        self.stdout.write('Creating demo users...')
        users = []
        
        # Create superuser if not exists
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@gearguard.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_superuser': True,
                'is_staff': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('  ✓ Created superuser: admin / admin123'))
        users.append(admin)
        
        # Create demo users
        demo_users = [
            {'username': 'john_tech', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Technician', 'password': 'password123'},
            {'username': 'jane_manager', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Manager', 'password': 'password123'},
            {'username': 'mike_operator', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Operator', 'password': 'password123'},
            {'username': 'sarah_tech', 'email': 'sarah@example.com', 'first_name': 'Sarah', 'last_name': 'Technician', 'password': 'password123'},
        ]
        
        for user_data in demo_users:
            password = user_data.pop('password')
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f"  ✓ Created user: {user_data['username']}")
            users.append(user)
        
        return users

    def create_companies(self):
        self.stdout.write('Creating demo companies...')
        companies = []
        
        company_data = [
            {
                'name': 'TechCorp Manufacturing',
                'code': 'TECH',
                'address': '123 Industrial Blvd, Tech City, TC 12345',
                'phone': '+1-555-0100',
                'email': 'contact@techcorp.com'
            },
            {
                'name': 'Global Industries Ltd',
                'code': 'GLOB',
                'address': '456 Factory Lane, Industry Town, IT 67890',
                'phone': '+1-555-0200',
                'email': 'info@globalind.com'
            }
        ]
        
        for data in company_data:
            company, created = Company.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            companies.append(company)
            if created:
                self.stdout.write(f"  ✓ Created company: {data['name']}")
        
        return companies

    def create_vendors(self):
        self.stdout.write('Creating demo vendors...')
        vendors = []
        
        vendor_data = [
            {
                'name': 'Industrial Parts Co',
                'contact_person': 'David Miller',
                'phone': '+1-555-1000',
                'email': 'sales@industrialparts.com',
                'address': '789 Parts Ave, Supply City, SC 11111',
                'website': 'www.industrialparts.com',
                'notes': 'Specialty: Hydraulic Systems'
            },
            {
                'name': 'Electrical Supply Inc',
                'contact_person': 'Lisa Anderson',
                'phone': '+1-555-2000',
                'email': 'info@electricalsupply.com',
                'address': '321 Electric St, Power Town, PT 22222',
                'website': 'www.electricalsupply.com',
                'notes': 'Specialty: Electrical Components'
            },
            {
                'name': 'Mechanical Solutions LLC',
                'contact_person': 'Tom Wilson',
                'phone': '+1-555-3000',
                'email': 'support@mechsolutions.com',
                'address': '654 Mechanical Dr, Engine City, EC 33333',
                'website': 'www.mechsolutions.com',
                'notes': 'Specialty: Mechanical Parts'
            }
        ]
        
        for data in vendor_data:
            vendor, created = Vendor.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            vendors.append(vendor)
            if created:
                self.stdout.write(f"  ✓ Created vendor: {data['name']}")
        
        return vendors

    def create_departments(self, company):
        self.stdout.write('Creating demo departments...')
        departments = []
        
        dept_data = [
            {'name': 'Maintenance', 'description': 'Equipment maintenance and repair'},
            {'name': 'Production', 'description': 'Manufacturing operations'},
            {'name': 'Quality Control', 'description': 'Quality assurance and testing'},
            {'name': 'Engineering', 'description': 'Process engineering and design'},
        ]
        
        for data in dept_data:
            dept, created = Department.objects.get_or_create(
                name=data['name'],
                company=company,
                defaults=data
            )
            departments.append(dept)
            if created:
                self.stdout.write(f"  ✓ Created department: {data['name']}")
        
        return departments

    def create_employees(self, company, departments, users):
        self.stdout.write('Creating demo employees...')
        employees = []
        
        employee_data = [
            {
                'user': users[1] if len(users) > 1 else users[0],
                'name': 'John Technician',
                'email': 'john@example.com',
                'department': departments[0],
                'position': 'Senior Maintenance Technician',
                'phone': '+1-555-4001'
            },
            {
                'user': users[2] if len(users) > 2 else users[0],
                'name': 'Jane Manager',
                'email': 'jane@example.com',
                'department': departments[0],
                'position': 'Maintenance Manager',
                'phone': '+1-555-4002'
            },
            {
                'user': users[3] if len(users) > 3 else users[0],
                'name': 'Mike Operator',
                'email': 'mike@example.com',
                'department': departments[1],
                'position': 'Machine Operator',
                'phone': '+1-555-4003'
            },
            {
                'user': users[4] if len(users) > 4 else users[0],
                'name': 'Sarah Technician',
                'email': 'sarah@example.com',
                'department': departments[0],
                'position': 'Junior Technician',
                'phone': '+1-555-4004'
            }
        ]
        
        for data in employee_data:
            emp, created = Employee.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            employees.append(emp)
            if created:
                self.stdout.write(f"  ✓ Created employee: {data['name']} ({data['position']})")
        
        return employees

    def create_workcenters(self, company):
        self.stdout.write('Creating demo work centers...')
        workcenters = []
        
        wc_data = [
            {'name': 'Assembly Line 1', 'code': 'AL1', 'company': company},
            {'name': 'CNC Machining', 'code': 'CNC1', 'company': company},
            {'name': 'Welding Station', 'code': 'WS1', 'company': company},
            {'name': 'Packaging Line', 'code': 'PL1', 'company': company},
        ]
        
        for data in wc_data:
            wc, created = WorkCenter.objects.get_or_create(
                code=data['code'],
                company=company,
                defaults=data
            )
            workcenters.append(wc)
            if created:
                self.stdout.write(f"  ✓ Created work center: {data['name']} ({data['code']})")
        
        return workcenters

    def create_teams(self, company, employees):
        self.stdout.write('Creating demo maintenance teams...')
        teams = []
        
        # Get users from employees
        user1 = employees[0].user if employees and employees[0].user else None
        user2 = employees[1].user if len(employees) > 1 and employees[1].user else None
        
        team_data = [
            {'name': 'Mechanical Team', 'description': 'Handles mechanical repairs and maintenance', 'leader': user1, 'company': company},
            {'name': 'Electrical Team', 'description': 'Handles electrical systems and repairs', 'leader': user2, 'company': company},
            {'name': 'Emergency Response', 'description': '24/7 emergency maintenance team', 'leader': user1, 'company': company},
        ]
        
        for data in team_data:
            team, created = MaintenanceTeam.objects.get_or_create(
                name=data['name'],
                company=company,
                defaults=data
            )
            
            # Add members to team
            if created and user1 and user2:
                team.members.add(user1, user2)
            
            teams.append(team)
            if created:
                self.stdout.write(f"  ✓ Created team: {data['name']}")
        
        return teams

    def create_categories(self):
        self.stdout.write('Creating demo equipment categories...')
        categories = []
        
        cat_data = [
            {'name': 'Hydraulic Equipment', 'description': 'Hydraulic presses, pumps, and systems'},
            {'name': 'Electrical Motors', 'description': 'Electric motors and drives'},
            {'name': 'Conveyor Systems', 'description': 'Material handling conveyors'},
            {'name': 'CNC Machines', 'description': 'Computer-controlled machining equipment'},
            {'name': 'HVAC Systems', 'description': 'Heating, ventilation, and air conditioning'},
        ]
        
        for data in cat_data:
            cat, created = EquipmentCategory.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            categories.append(cat)
            if created:
                self.stdout.write(f"  ✓ Created category: {data['name']}")
        
        return categories

    def create_equipment(self, company, workcenters, categories, vendors):
        self.stdout.write('Creating demo equipment...')
        equipment_list = []
        
        equip_data = [
            {
                'name': 'Hydraulic Press HP-2000',
                'serial_number': 'HT2000-2023-001',
                'category': categories[0],
                'work_center': workcenters[0],
                'purchase_date': timezone.now().date() - timedelta(days=900),
                'warranty_expiry_date': timezone.now().date() + timedelta(days=100),
                'vendor': vendors[0] if vendors else None,
                'company': company,
                'is_active': True,
                'description': 'Industrial hydraulic press, 2000 ton capacity'
            },
            {
                'name': 'CNC Milling Machine',
                'serial_number': 'PM500-2022-045',
                'category': categories[3],
                'work_center': workcenters[1],
                'purchase_date': timezone.now().date() - timedelta(days=600),
                'warranty_expiry_date': timezone.now().date() - timedelta(days=50),
                'vendor': vendors[2] if len(vendors) > 2 else None,
                'company': company,
                'is_active': True,
                'description': '5-axis CNC milling machine for precision parts'
            },
            {
                'name': 'Conveyor Belt System A1',
                'serial_number': 'CT3000-2023-012',
                'category': categories[2],
                'work_center': workcenters[0],
                'purchase_date': timezone.now().date() - timedelta(days=400),
                'warranty_expiry_date': timezone.now().date() + timedelta(days=200),
                'vendor': vendors[0] if vendors else None,
                'company': company,
                'is_active': True,
                'description': 'Material handling conveyor system, 30m length'
            },
            {
                'name': 'Industrial Motor 50HP',
                'serial_number': 'EM50-2023-089',
                'category': categories[1],
                'work_center': workcenters[2],
                'purchase_date': timezone.now().date() - timedelta(days=300),
                'warranty_expiry_date': timezone.now().date() + timedelta(days=300),
                'vendor': vendors[1] if len(vendors) > 1 else None,
                'company': company,
                'is_active': True,
                'description': '50HP AC induction motor for heavy machinery'
            },
            {
                'name': 'HVAC Unit - Building A',
                'serial_number': 'CC5000-2021-032',
                'category': categories[4],
                'work_center': workcenters[3],
                'purchase_date': timezone.now().date() - timedelta(days=1200),
                'warranty_expiry_date': timezone.now().date() - timedelta(days=300),
                'vendor': vendors[1] if len(vendors) > 1 else None,
                'company': company,
                'is_active': True,
                'description': 'Central HVAC system for building A, 5000 BTU capacity'
            }
        ]
        
        for data in equip_data:
            equip, created = Equipment.objects.get_or_create(
                serial_number=data['serial_number'],
                defaults=data
            )
            equipment_list.append(equip)
            if created:
                self.stdout.write(f"  ✓ Created equipment: {data['name']} ({data['serial_number']})")
        
        return equipment_list

    def create_maintenance_requests(self, equipment_list, employees, teams):
        self.stdout.write('Creating demo maintenance requests...')
        requests = []
        
        # Get users from employees
        user1 = employees[0].user if employees and employees[0].user else None
        user2 = employees[2].user if len(employees) > 2 and employees[2].user else None
        
        request_data = [
            {
                'equipment': equipment_list[0],
                'request_type': 'corrective',
                'priority': 3,  # High
                'name': 'Hydraulic leak detected',
                'description': 'Hydraulic fluid leaking from main cylinder seal',
                'status': 'in_progress',
                'created_by': user2,
                'maintenance_team': teams[0] if teams else None,
                'request_date': timezone.now().date() - timedelta(days=2)
            },
            {
                'equipment': equipment_list[1],
                'request_type': 'preventive',
                'priority': 2,  # Medium
                'name': 'Scheduled lubrication service',
                'description': 'Quarterly lubrication and inspection as per maintenance schedule',
                'status': 'new',
                'created_by': user1,
                'maintenance_team': teams[0] if teams else None,
                'request_date': timezone.now().date() - timedelta(days=1)
            },
            {
                'equipment': equipment_list[2],
                'request_type': 'corrective',
                'priority': 4,  # Critical
                'name': 'Conveyor belt misalignment',
                'description': 'Belt tracking off center, causing operational issues',
                'status': 'repaired',
                'created_by': user2,
                'maintenance_team': teams[0] if teams else None,
                'request_date': timezone.now().date() - timedelta(days=7),
                'scheduled_date': timezone.now() - timedelta(days=6),
                'completion_date': timezone.now().date() - timedelta(days=5)
            },
            {
                'equipment': equipment_list[3],
                'request_type': 'corrective',
                'priority': 3,  # High
                'name': 'Motor overheating issue',
                'description': 'Motor running hot during operation, temperature exceeding safe limits',
                'status': 'in_progress',
                'created_by': user2,
                'maintenance_team': teams[1] if len(teams) > 1 else teams[0],
                'request_date': timezone.now().date(),
                'scheduled_date': timezone.now() - timedelta(hours=6)
            },
            {
                'equipment': equipment_list[4],
                'request_type': 'preventive',
                'priority': 1,  # Low
                'name': 'Annual HVAC filter replacement',
                'description': 'Replace air filters and clean coils as part of annual maintenance',
                'status': 'new',
                'created_by': user1,
                'maintenance_team': teams[0] if teams else None,
                'request_date': timezone.now().date()
            }
        ]
        
        for data in request_data:
            request, created = MaintenanceRequest.objects.get_or_create(
                equipment=data['equipment'],
                name=data['name'],
                defaults=data
            )
            requests.append(request)
            if created:
                self.stdout.write(f"  ✓ Created request: {data['name']}")
        
        return requests

    def create_maintenance_logs(self, requests, employees):
        self.stdout.write('Creating demo maintenance logs...')
        
        # Get users from employees
        user1 = employees[0].user if employees and employees[0].user else None
        user2 = employees[1].user if len(employees) > 1 and employees[1].user else None
        
        log_data = [
            {
                'request': requests[2],  # Completed request
                'user': user1,
                'action': 'Status Changed',
                'old_status': 'new',
                'new_status': 'repaired',
                'notes': 'Adjusted belt tension and alignment. Replaced worn rollers. Parts used: Conveyor rollers x2, Belt tension bolts x4. Time spent: 3.5 hours.'
            },
            {
                'request': requests[0],  # In progress request
                'user': user1,
                'action': 'Investigation',
                'old_status': 'new',
                'new_status': 'in_progress',
                'notes': 'Identified leak source. Ordered replacement seal. Awaiting parts delivery.'
            },
            {
                'request': requests[3],  # Motor overheating
                'user': user2,
                'action': 'Maintenance Started',
                'old_status': 'new',
                'new_status': 'in_progress',
                'notes': 'Cleaned motor cooling fins. Checked bearing lubrication. Used bearing grease and cleaning supplies. Time spent: 2.0 hours.'
            }
        ]
        
        for data in log_data:
            log, created = MaintenanceLog.objects.get_or_create(
                request=data['request'],
                user=data['user'],
                action=data['action'],
                defaults=data
            )
            if created:
                self.stdout.write(f"  ✓ Created maintenance log for: {data['request'].name}")

    def create_scheduled_maintenance(self, equipment_list, teams):
        self.stdout.write('Creating demo scheduled maintenance...')
        
        schedule_data = [
            {
                'equipment': equipment_list[0],
                'name': 'Monthly hydraulic system check',
                'description': 'Inspect hydraulic fluid levels, check for leaks, test pressure',
                'frequency': 'monthly',
                'next_run_date': timezone.now().date() + timedelta(days=15),
                'maintenance_team': teams[0] if teams else None,
                'is_active': True
            },
            {
                'equipment': equipment_list[1],
                'name': 'CNC machine calibration',
                'description': 'Calibrate axes, check tool offsets, verify accuracy',
                'frequency': 'quarterly',
                'next_run_date': timezone.now().date() + timedelta(days=45),
                'maintenance_team': teams[0] if teams else None,
                'is_active': True
            },
            {
                'equipment': equipment_list[2],
                'name': 'Conveyor safety inspection',
                'description': 'Weekly safety inspection of guards, emergency stops, and belt condition',
                'frequency': 'weekly',
                'next_run_date': timezone.now().date() + timedelta(days=3),
                'maintenance_team': teams[0] if teams else None,
                'is_active': True
            },
            {
                'equipment': equipment_list[4],
                'name': 'HVAC filter replacement',
                'description': 'Replace air filters and inspect system operation',
                'frequency': 'quarterly',
                'next_run_date': timezone.now().date() + timedelta(days=30),
                'maintenance_team': teams[1] if len(teams) > 1 else teams[0],
                'is_active': True
            }
        ]
        
        for data in schedule_data:
            schedule, created = ScheduledMaintenance.objects.get_or_create(
                equipment=data['equipment'],
                name=data['name'],
                defaults=data
            )
            if created:
                self.stdout.write(f"  ✓ Created schedule: {data['name']}")
