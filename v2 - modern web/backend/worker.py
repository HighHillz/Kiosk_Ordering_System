import time
import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.cache import cache

def process_orders():
    print("Starting Kitchen Order Worker...")
    print("Waiting for orders from 'kitchen_orders' queue...")
    
    while True:
        try:
            # Blocking pop from list - waits 5 seconds then loops
            # This is efficient as it avoids busy waiting
            result = cache.brpop("kitchen_orders", timeout=5)
            
            if result:
                queue_name, data = result
                print(f" [x] Received Order #{data.get('order_number')} (ID: {data.get('order_id')})")
                print(f"     Items: {len(data.get('items'))}")
                
                # Simulate processing time
                # In a real system, this might print a ticket or update a specialized KDS DB
                print("     Processing...", end="", flush=True)
                time.sleep(2) 
                print(" Done")
                
        except Exception as e:
            if "Connection refused" in str(e):
                print("Redis connection failed. Retrying in 5s...")
                time.sleep(5)
            else:
                print(f"Error: {e}")
                time.sleep(1)

if __name__ == "__main__":
    try:
        process_orders()
    except KeyboardInterrupt:
        print("\nWorker stopped.")
