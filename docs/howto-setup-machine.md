## How Build a Proxy Retrieval Server Instance

### Starting Point

Provision an `m5ad.12xlarge` on AWS.   Give it a root volume size of 1023 GB.  It will come with 2x900 GB SSD drives.  We'll mount one at `/home/ubuntu` and another at `/mnt/ssd`.

### Basic Setup

- Set hostname
	- `sudo hostname XXXXXX`
	- `sudo vi /etc/hostname`
- Partitioning and Swap:

```
	// change the number 900GB to full size of disk
	sudo parted --script /dev/nvme1n1 mklabel gpt mkpart primary ext4 1MB 900GB
	sudo parted --script /dev/nvme2n1 mklabel gpt mkpart primary ext4 1MB 900GB

	sudo mkfs.ext4 -L myext4 /dev/nvme1n1p1
	sudo mkfs.ext4 -L myext4 /dev/nvme2n1p1
```


- Put in /etc/fstab:


```
		/dev/nvme1n1p1 /mnt/ssd ext4 defaults 0 0
		/dev/nvme2n1p1 /home/ubuntu ext4 defaults 0 0
```

- Mount points:

```
	sudo mkdir /mnt/ssd
	sudo mount /dev/nvme1n1p1

	# All one command:
	sudo mkdir /mnt/ssd/home-ubuntu-temp && \
	sudo rsync -Pavr /home/ubuntu/ /mnt/ssd/home-ubuntu-temp && \
	cd /home && \
	sudo rm -rf /home/ubuntu && \
	sudo mkdir /home/ubuntu && \
	sudo mount /home/ubuntu && \
	sudo rsync -Pavr /mnt/ssd/home-ubuntu-temp/ /home/ubuntu && \
	sudo chown -R ubuntu:ubuntu ~ && \
	sudo rm -rf /mnt/ssd/home-ubuntu-temp/
```

- Swapfile:

```
		sudo fallocate -l 200G /mnt/ssd/swapfile
		sudo chmod 600 /mnt/ssd/swapfile
		sudo mkswap /mnt/ssd/swapfile
		sudo swapon /mnt/ssd/swapfile
		free -g
		swapon -s  # to verify
```

- Make a symlink for large directory `/var/tmp/filecoin-proof-parameters/`

```
	sudo mkdir /mnt/ssd/filecoin-proof-parameters
	sudo chown -R ubuntu:ubuntu /mnt/ssd/filecoin-proof-parameters 
	sudo ln -s /mnt/ssd/filecoin-proof-parameters /var/tmp/filecoin-proof-parameters
	sudo chown -R ubuntu:ubuntu /var/tmp/filecoin-proof-parameters/
```

- Update the machine
```
	sudo apt update && sudo apt upgrade -y
	sudo reboot now
```

### Compile and Install Lotus

- Install Lotus deps:

```
	echo 'ulimit -n 10000' >> ~/.bashrc
	sudo apt update && \
	sudo apt install -y mesa-opencl-icd ocl-icd-opencl-dev make && \
	sudo add-apt-repository -y ppa:longsleep/golang-backports && \
	sudo apt update && \
	sudo apt install -y golang-go gcc git bzr jq pkg-config mesa-opencl-icd ocl-icd-opencl-dev llvm clang
```

- Install Rust:

```
	cd ~
	export RUSTFLAGS="-C target-cpu=native -g"
	export FFI_BUILD_FROM_SOURCE=1
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
		# Pick these for rust:
		# x86_64-unknown-linux-gnu
		# stable
		# complete
	source $HOME/.cargo/env
```

- Logout, then log back in

- Compile and install Lotus daemon

```
	git clone https://github.com/filecoin-project/lotus.git
	cd lotus
	git checkout -b v0.8.1 // replace with latest version
	make clean && make all && sudo make install
	nohup lotus daemon --import-snapshot https://very-temporary-spacerace-chain-snapshot.s3-us-west-2.amazonaws.com/Spacerace_pruned_stateroots_snapshot_latest.car > ~/lotus-daemon.log &
	tail -f ~/lotus-daemon.log
```

- Wait for `lotus sync wait` to finish

- Firewall and Lotus configs

```
	sudo ufw allow 22
	sudo ufw allow 1234
	sudo ufw allow 2345
	sudo ufw allow 5555
	sudo ufw allow 5556
	sudo ufw allow 80
	sudo ufw allow 443
	sudo ufw enable

	vi ~/.lotus/config.toml
	# ADD THESE LINES (ADJUST IP TO EXTERNAL IP):
		ListenAddress = "/ip4/0.0.0.0/tcp/1234/http"
		RemoteListenAddress = "/ip4/0.0.0.0/tcp/1234/http"

		ListenAddresses = ["/ip4/0.0.0.0/tcp/5555"]
		AnnounceAddresses = ["/ip4/A.B.C.D/tcp/5555", "/ip4/127.0.0.1/tcp/5555"]
```

- Restart Lotus daemon

```
lotus daemon stop
ps aux | grep lotus    # verify daemon stop - takes a few sec
nohup lotus daemon > ~/lotus-daemon.log &
```

- Generate wallets

```
	lotus wallet new >> wallet.txt
	lotus wallet export t1xxxxxxxxxxxxx >> wallet.txt
	lotus wallet export t1xxxxxxxxxxxxx | xxd -r -p >> wallet.txt
	echo "" >> wallet.txt
	lotus wallet new bls >> wallet.txt
	lotus wallet export t3yyyyyyyyyyyyy >> wallet.txt
	lotus wallet export t3yyyyyyyyyyyyy | xxd -r -p >> wallet.txt
```

- (Optional) Lotus Miner Setup

```
	# Fund the t3xxxxxxxxxxx wallet from some other source, enough for init gas prices:
	
	lotus send --gas-limit 10000000 --gas-feecap 10000000 --gas-premium 10000000 --from t1poe76utjdqe7grf2mkk55xeymxsdtf5piefccki t3squijkcyh5fa4ch5pkej6tqav4zeo2h7h4r74u42srphinzrsan67xcv55dergimbmgfrsbgmyyk4rrkmb6q 2
		# t1poe is the from wallet
		# t3squi is the recipient wallet
		# 2 = amount of FIL to send (in FIL)

	# If message gets stuck in `lotus mpool pending --local` then do:
		lotus mpool pending --local # to get the nonce
		lotus mpool replace --auto FROM_ADDRESS NONCE
	# Another way to push through stuck messages is a zero send:
		lotus mpool send --from t1a25ihzpz7jb6wgjkkd7cndnhgo4zbbap6jc5pta --nonce NONCE --gas-premium 250000 --gas-limit 100000 --gas-feecap 2000000000 t1a25ihzpz7jb6wgjkkd7cndnhgo4zbbap6jc5pta 0

	# init the miner and get miner id
	nohup lotus-miner init --worker T3_WALLET_FUNDED_IN_PR  > ~/lotus-miner.log &
	tail -f ~/lotus-miner.log
	
	# get the miner id once init suceeds ==> wallet.txt
	lotus-miner stop
	ps aux | grep lotus-miner   # until it's definitely not running

	# add these to ~/.lotusminer/config.toml (substitute your IP)
		ListenAddress = "/ip4/127.0.0.1/tcp/2345/http"
		RemoteListenAddress = "0.0.0.0:2345"

		ListenAddresses = ["/ip4/0.0.0.0/tcp/5556"]
		AnnounceAddresses = ["/ip4/184.167.12.226/tcp/5556", "/ip4/127.0.0.1/tcp/5556"]

	# run lotus-miner
	nohup lotus-miner run > ~/lotus-miner.log &
```

### Additional Installs

- Install nvm

```
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	command -v nvm 					# to check; should say 'nvm'
```

- Install node:

```
	nvm install node
```

- Install Caddy and stop it:

```
	echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" \
	    | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list
	sudo apt update
	sudo apt install caddy
	caddy stop
```
