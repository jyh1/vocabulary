prepare:
	cd frontend; npm install

dev: frontend
	cd frontend; npm start

build: frontend
	cd frontend; npm run build && rm -r ../docs && mv build ../docs